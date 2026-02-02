using System;

namespace ToeicMaster.API.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public string TransactionNo { get; set; } // VNPAY TransactionId
        public int Amount { get; set; } // VND
        public string OrderInfo { get; set; } // "Premium Standard - 3 months"
        public string PackageType { get; set; } // "Starter", "Standard", "Pro", "Master"
        public int DurationMonths { get; set; }

        public string PaymentStatus { get; set; } // "PENDING", "SUCCESS", "FAILED", "CANCELLED"
        public string PaymentMethod { get; set; } // "VNPAY", "Credit", "Debit"
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
        
        public string ResponseCode { get; set; } // VNPAY response code (00 = success)
        public string ResponseMessage { get; set; }
        
        // Subscription related
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }
        public bool IsSubscriptionActive { get; set; } = false;
    }
}
