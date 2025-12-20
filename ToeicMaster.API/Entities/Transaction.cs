using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Transaction
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal Amount { get; set; }

    public string? Content { get; set; }

    public string? Status { get; set; }

    public string? PaymentGateway { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
