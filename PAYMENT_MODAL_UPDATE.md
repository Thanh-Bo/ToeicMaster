# Payment Modal Update - Subscription Tiers

## Changes Made

### ✅ Frontend Changes

#### 1. **PaymentModal.tsx** - Completely Redesigned
- ✅ Removed single lifetime subscription 
- ✅ Added 3 subscription tiers: 1 Tháng, 3 Tháng, 6 Tháng
- ✅ Added Premium Benefits section with checkmarks
- ✅ Added pricing/discount display
- ✅ Added tier selection interface
- ✅ Added "Back" button to change tier selection
- ✅ Updated QR display to show selected tier info

**New Props (removed old ones):**
```tsx
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}
```

**Subscription Tiers:**
- **1 Tháng**: ₫30,000 (0% discount)
- **3 Tháng**: ₫79,000 (11% discount from ₫90,000)
- **6 Tháng**: ₫149,000 (17% discount from ₫180,000)

**Premium Benefits:**
- Mở khoá tất cả nội dung bài học
- Mở khoá tính năng nâng cao (trà từ điển, hỏi AI...)
- Không quảng cáo
- Ưu tiên hỗ trợ
- Trạng theo dõi tiếng độ học toàn hệ thống

#### 2. **PremiumUpgradeButton.tsx** - Updated
- Removed `amount` and `description` props
- Modal now handles all tier selection internally

---

### ✅ Backend Changes

#### 1. **PaymentController.cs** - Updated
- Updated `InitiatePaymentRequest` to include `Duration` field (months)
- Updated transaction creation to store `SubscriptionDurationMonths`

**New Request Model:**
```csharp
public class InitiatePaymentRequest
{
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public int Duration { get; set; } // Duration in months (1, 3, 6)
}
```

#### 2. **Transaction.cs** - Entity Updated
- Added `SubscriptionDurationMonths` nullable int property
- Stores subscription duration for reference (1, 3, 6 months)

#### 3. **Database Migration**
- Created migration: `20260314_AddSubscriptionDurationToTransaction`
- Adds column to Transaction table

---

## How to Deploy

### Step 1: Apply Database Migration
```bash
cd D:\ToeicMaster\ToeicMaster.API
dotnet ef database update
```

Or if using migrations manually:
```bash
dotnet ef migrations add AddSubscriptionDurationToTransaction
dotnet ef database update
```

### Step 2: Rebuild Backend
```bash
dotnet build
dotnet run
```

### Step 3: Frontend - No changes needed
- Components are already updated
- Just ensure `NEXT_PUBLIC_API_URL` is set correctly

---

## Payment Flow with Tiers

```
1. User clicks "Nâng cấp PRO"
   ↓
2. PaymentModal opens showing:
   - Premium Benefits list
   - 3 subscription tier options
   ↓
3. User selects a tier (1/3/6 months)
   ↓
4. User clicks "Tiếp tục thanh toán ₫[amount]"
   ↓
5. Backend creates Transaction with:
   - UserId
   - Amount (based on selected tier)
   - Description (Premium 1/3/6 Tháng)
   - SubscriptionDurationMonths (1/3/6)
   - Status: PENDING
   ↓
6. QR code generated showing:
   - Selected tier
   - Correct amount
   ↓
7. User scans QR or manually transfers
   ↓
8. Frontend polls payment status every 5 seconds
   ↓
9. When confirmed → Success modal + callback
   ↓
10. Application grants premium access for duration months
```

---

## Database Schema Change

**New Transaction Column:**
```sql
ALTER TABLE [Transaction] 
ADD [SubscriptionDurationMonths] INT NULL;
```

---

## API Endpoint Example

### Before (Old):
```json
POST /api/v1/payment/initiate
{
  "amount": 980000,
  "description": "Premium PRO Trọn đời"
}
```

### After (New):
```json
POST /api/v1/payment/initiate
{
  "amount": 79000,
  "description": "Premium 3 Tháng",
  "duration": 3
}
```

### Response:
```json
{
  "transactionId": 123,
  "amount": 79000,
  "description": "Premium 3 Tháng",
  "status": "PENDING",
  "qrCode": "base64...",
  "bankInfo": {...},
  "message": "Payment initiated..."
}
```

---

## Next Steps (Implementation)

1. **Update Premium Status Logic**
   - When payment confirmed, grant premium for N months
   - Modify `POST /api/v1/payment/confirm/{id}` to:
     - Read `SubscriptionDurationMonths` from transaction
     - Calculate expiry date: `now + duration months`
     - Update User.IsPremium = true
     - Update User.PremiumExpiryDate (if exists)

2. **Create Database Column for Premium Expiry**
   ```csharp
   public DateTime? PremiumExpiryDate { get; set; }
   ```

3. **Add Premium Check Middleware**
   - Check if `DateTime.UtcNow` > `PremiumExpiryDate`
   - Auto-downgrade when expired

4. **Update Payment Confirmation (Optional)**
   - Send email confirmation with:
     - Duration
     - Expiry date
     - Features unlocked

---

## Pricing Configuration

Prices are hardcoded in `PaymentModal.tsx`:
```tsx
const subscriptionTiers: SubscriptionTier[] = [
  {
    duration: 1,
    basePrice: 30000,
    originalPrice: 30000,
    discount: 0,
  },
  // ...
];
```

To change prices, update these values in the component.

---

## Testing Checklist

- [ ] QR code generation works
- [ ] Tier selection updates button text and amount
- [ ] "Back" button resets form
- [ ] Payment status polling works
- [ ] Database stores `SubscriptionDurationMonths`
- [ ] Mobile responsive design
- [ ] Dark mode works correctly

---

## Troubleshooting

### "Database update failed"
```bash
# Regenerate migrations properly
dotnet ef migrations remove
dotnet ef migrations add AddSubscriptionDurationToTransaction
dotnet ef database update
```

### QR code not showing right amount
- Check `selectedTier.basePrice` is used correctly
- Verify backend receives `amount` parameter

### Tier selection not working
- Check browser console for errors
- Verify state management in PaymentModal

---

## Support

For issues with:
- **Tier prices** → Update `PaymentModal.tsx` constants
- **Database** → Run migrations from API folder
- **UI styling** → Modify Tailwind classes in component
