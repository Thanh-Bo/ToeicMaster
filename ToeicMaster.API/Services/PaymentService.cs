using System;
using System.Drawing;
using System.IO;
using System.Text;
using Microsoft.Extensions.Configuration;
using QRCoder;

namespace ToeicMaster.API.Services;

public interface IPaymentService
{
    /// <summary>
    /// Generates a QR code for bank transfer payment
    /// </summary>
    (string QrCodeBase64, string ManualTransferData) GenerateQRCode(
        int userId,
        decimal amount,
        string description,
        int transactionId
    );

    /// <summary>
    /// Gets bank account information for manual transfer
    /// </summary>
    BankAccountInfo GetBankAccountInfo();
}

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public PaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string QrCodeBase64, string ManualTransferData) GenerateQRCode(
        int userId,
        decimal amount,
        string description,
        int transactionId
    )
    {
        var bankSettings = _configuration.GetSection("BankSettings");
        var bankName = bankSettings["BankName"];
        var accountNumber = bankSettings["AccountNumber"];
        var accountHolder = bankSettings["AccountHolder"];
        var bankCode = bankSettings["BankCode"];

        // Build transfer data for manual entry
        var transferData = BuildTransferData(
            accountNumber,
            accountHolder,
            amount,
            description,
            bankCode
        );

        // Generate QR code
        var qrCodeBase64 = GenerateQRCodeBase64(transferData);

        return (qrCodeBase64, transferData);
    }

    public BankAccountInfo GetBankAccountInfo()
    {
        var bankSettings = _configuration.GetSection("BankSettings");
        return new BankAccountInfo
        {
            BankName = bankSettings["BankName"],
            AccountNumber = bankSettings["AccountNumber"],
            AccountHolder = bankSettings["AccountHolder"],
            BankCode = bankSettings["BankCode"]
        };
    }

    /// <summary>
    /// VietinBank QR format: https://vietqr.io/
    /// Format: https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.png?amount={amount}&addInfo={description}
    /// </summary>
    private string BuildTransferData(
        string accountNumber,
        string accountHolder,
        decimal amount,
        string description,
        string bankCode
    )
    {
        var encodedDescription = Uri.EscapeDataString(description);
        return $"https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.png?amount={(long)amount}&addInfo={encodedDescription}";
    }

    /// <summary>
    /// Generates QR code image as Base64 string
    /// </summary>
    private string GenerateQRCodeBase64(string transferData)
    {
        using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
        {
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(
                transferData,
                QRCodeGenerator.ECCLevel.Q
            );

            using (QRCode qrCode = new QRCode(qrCodeData))
            {
                using (Bitmap qrImage = qrCode.GetGraphic(20))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        qrImage.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        byte[] qrImageBytes = ms.ToArray();
                        return Convert.ToBase64String(qrImageBytes);
                    }
                }
            }
        }
    }
}

public class BankAccountInfo
{
    public string BankName { get; set; }
    public string AccountNumber { get; set; }
    public string AccountHolder { get; set; }
    public string BankCode { get; set; }
}
