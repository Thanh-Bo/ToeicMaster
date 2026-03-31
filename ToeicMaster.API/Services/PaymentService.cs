using Microsoft.Extensions.Configuration;

namespace ToeicMaster.API.Services;

public interface IPaymentService
{
    /// <summary>
    /// Returns a VietQR image URL for the bank transfer (cross-platform, no System.Drawing)
    /// </summary>
    (string VietQrUrl, string TransferData) GenerateVietQR(
        int userId,
        decimal amount,
        string description,
        int transactionId
    );

    BankAccountInfo GetBankAccountInfo();
}

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public PaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string VietQrUrl, string TransferData) GenerateVietQR(
        int userId,
        decimal amount,
        string description,
        int transactionId
    )
    {
        var bankSettings = _configuration.GetSection("BankSettings");
        var accountNumber = bankSettings["AccountNumber"];
        var bankCode = bankSettings["BankCode"];

        // Build VietQR image URL — works cross-platform, no QRCoder needed
        // The URL itself IS an image rendered by vietqr.io that works in any <img> tag
        var encodedDesc = Uri.EscapeDataString(description ?? "Thanh toan TOEIC Master");
        var vietQrUrl =
            $"https://img.vietqr.io/image/{bankCode}-{accountNumber}-qr_only.png?amount={(long)amount}&addInfo={encodedDesc}";

        return (vietQrUrl, vietQrUrl);
    }

    public BankAccountInfo GetBankAccountInfo()
    {
        var bankSettings = _configuration.GetSection("BankSettings");
        return new BankAccountInfo
        {
            BankName = bankSettings["BankName"],
            AccountNumber = bankSettings["AccountNumber"],
            AccountHolder = bankSettings["AccountHolder"],
            BankCode = bankSettings["BankCode"],
        };
    }
}

public class BankAccountInfo
{
    public string BankName { get; set; }
    public string AccountNumber { get; set; }
    public string AccountHolder { get; set; }
    public string BankCode { get; set; }
}
