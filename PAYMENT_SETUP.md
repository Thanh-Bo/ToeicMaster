# Payment System Setup Guide

## Overview
Complete bank transfer payment system with QR code generation for VietinBank/Vietnamese banks.

**What's Included:**
- ✅ Backend: QR code generation + Payment endpoints
- ✅ Frontend: Payment modal with QR display + status polling
- ✅ Database: Transaction tracking (already exists)

---

## Backend Setup

### 1. Install NuGet Package
```bash
cd D:\ToeicMaster\ToeicMaster.API
dotnet add package QRCoder
```

Or via Package Manager:
```
Install-Package QRCoder
```

### 2. Configuration Already Added
Bank settings added to `appsettings.json`:
```json
"BankSettings": {
  "BankName": "VietinBank",
  "AccountNumber": "109867267182",
  "AccountHolder": "HOANG VAN TRUNG",
  "BankCode": "970425"
}
```

**Update these values with your actual bank account!**

### 3. Files Created/Modified
- ✅ `Services/PaymentService.cs` - QR code generation
- ✅ `Controllers/PaymentController.cs` - Payment API endpoints
- ✅ `Program.cs` - Service registration
- ✅ `appsettings.json` - Bank configuration

### 4. Available Backend Endpoints

#### POST `/api/v1/payment/initiate`
Initiate payment and generate QR code.

**Request:**
```json
{
  "amount": 980000,
  "description": "Premium PRO Trọn đời"
}
```

**Response:**
```json
{
  "transactionId": 123,
  "amount": 980000,
  "status": "PENDING",
  "qrCode": "base64_image_data",
  "bankInfo": {
    "bankName": "VietinBank",
    "accountNumber": "109867267182",
    "accountHolder": "HOANG VAN TRUNG",
    "bankCode": "970425"
  },
  "transferData": "https://img.vietqr.io/image/...",
  "message": "Payment initiated..."
}
```

---

#### GET `/api/v1/payment/status/{transactionId}`
Check payment status.

**Response:**
```json
{
  "transactionId": 123,
  "amount": 980000,
  "status": "COMPLETED",
  "isPaid": true
}
```

---

#### POST `/api/v1/payment/confirm/{transactionId}`
Confirm payment (called by bank webhook or manually).

**Request:**
```json
{
  "amount": 980000,
  "transactionReference": "VT20260314123456"
}
```

---

#### GET `/api/v1/payment/bank-info`
Get bank account info (no auth required).

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd D:\ToeicMaster\toeic-web
npm install react-hot-toast lucide-react
```

### 2. Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5298
# or for production:
# NEXT_PUBLIC_API_URL=https://your-api.com
```

### 3. Files Created
- ✅ `components/payment/PaymentModal.tsx` - Main payment UI
- ✅ `components/payment/PremiumUpgradeButton.tsx` - Example usage
- ✅ `services/paymentService.ts` - Payment API client

---

## How to Use in Your App

### Option 1: Simple Button
```tsx
import PremiumUpgradeButton from "@/app/components/payment/PremiumUpgradeButton";

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      <PremiumUpgradeButton />
    </div>
  );
}
```

### Option 2: Custom Integration
```tsx
"use client";

import { useState } from "react";
import PaymentModal from "@/app/components/payment/PaymentModal";

export default function MyComponent() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <>
      <button onClick={() => setShowPayment(true)}>
        Upgrade to Premium
      </button>

      <PaymentModal
        isOpen={showPayment}
        amount={980000}
        description="Premium PRO Trọn đời"
        onClose={() => setShowPayment(false)}
        onPaymentSuccess={() => {
          console.log("Payment successful!");
          // Refresh user data, redirect, etc.
        }}
      />
    </>
  );
}
```

---

## Payment Flow

```
1. User clicks "Upgrade Premium"
   ↓
2. PaymentModal opens with amount
   ↓
3. User clicks "Tiếp tục thanh toán"
   ↓
4. Backend generates QR code + Transaction record
   ↓
5. Modal displays:
   - QR Code (to scan)
   - Bank Account Info (to type manually)
   - Copy buttons for easy entry
   ↓
6. User scans QR or manually transfers
   ↓
7. Frontend polls /api/v1/payment/status every 5 seconds
   ↓
8. When bank confirms payment:
   - Status updates to COMPLETED
   - Modal shows success ✅
   - onPaymentSuccess() callback fires
   ↓
9. Application updates (refresh user, redirect, etc.)
```

---

## How QR Code Works

The QR code encodes VietinBank transfer data:
- **URL**: `https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.png`
- **Parameters**:
  - `amount`: Transfer amount
  - `addInfo`: Description (what user is paying for)

When user scans with VietinBank app, it auto-fills:
- Recipient account
- Amount
- Description

---

## Real-World Implementation Checklist

### For Production:
- [ ] Update bank account in `appsettings.json`
- [ ] Change QR logo/branding if needed
- [ ] Integrate with actual bank API/webhook for automatic payment confirmation
- [ ] Add payment history page
- [ ] Update user premium status when payment confirmed
- [ ] Add email notification for successful payment
- [ ] Set up payment retry logic
- [ ] Add transaction amount validation
- [ ] Implement admin payment dashboard
- [ ] Add payment analytics/reports

### Security:
- [ ] Verify JWT tokens on all payment endpoints
- [ ] Add SQL injection protection (already in use)
- [ ] Add rate limiting on payment endpoints
- [ ] Log all payment attempts
- [ ] Validate amount against database record
- [ ] Add HMAC verification for webhooks

---

## Troubleshooting

### QR Code not generating?
- Ensure QRCoder NuGet package is installed
- Check bank account info in appsettings.json
- Verify API endpoint is accessible

### Payment status not updating?
- Check browser console for errors
- Verify access token is valid
- Check that transactionId matches

### Amount not appearing in QR?
- Verify amount is > 0
- Check amount formatting in backend

---

## VietQR Support

The system uses [VietQR.io](https://vietqr.io) service which supports:
- VietinBank
- Agribank
- BIDV
- VCB
- And 30+ other Vietnamese banks

To support other banks, they must support VietQR standard.

---

## Next Steps

1. **Test Locally**:
   ```bash
   # Terminal 1: Backend
   cd ToeicMaster.API
   dotnet run
   
   # Terminal 2: Frontend
   cd toeic-web
   npm run dev
   ```

2. **Test Payment Flow**:
   - Visit payment modal
   - Generate QR
   - Check payment status endpoint
   - Verify transaction in database

3. **Implement Premium Features**:
   - Update `POST /api/v1/payment/confirm` to grant premium access
   - Update User model with premium flag
   - Add middleware to check premium status

---

## Questions?
Refer to the code comments in PaymentController.cs and PaymentModal.tsx for detailed documentation.
