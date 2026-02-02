namespace ToeicMaster.API.Models
{
    public class CreatePaymentRequest
    {
        public string PackageType { get; set; } // "Starter", "Standard", "Pro", "Master"
        public int DurationMonths { get; set; }
        public long Amount { get; set; } // VND
    }

    public class CreatePaymentResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string PaymentUrl { get; set; }        public string QrCode { get; set; }
        public string Deeplink { get; set; }        public long OrderId { get; set; }
    }

    public class PaymentCallbackRequest
    {
        public string vnp_Amount { get; set; }
        public string vnp_BankCode { get; set; }
        public string vnp_BankTranNo { get; set; }
        public string vnp_CardType { get; set; }
        public string vnp_OrderInfo { get; set; }
        public string vnp_PayDate { get; set; }
        public string vnp_ResponseCode { get; set; }
        public string vnp_SecureHash { get; set; }
        public string vnp_TmnCode { get; set; }
        public string vnp_TransactionNo { get; set; }
        public string vnp_TxnRef { get; set; }
    }

    public class PaymentStatusResponse
    {
        public int PaymentId { get; set; }
        public string TransactionNo { get; set; }
        public string Status { get; set; } // PENDING, SUCCESS, FAILED
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public int Amount { get; set; }
        public string PackageType { get; set; }
    }
}
