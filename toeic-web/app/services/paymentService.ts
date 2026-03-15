const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5298";

export interface PaymentResponse {
  transactionId: number;
  amount: number;
  description: string;
  status: string;
  qrCode: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    bankCode: string;
  };
  transferData: string;
  message: string;
}

export interface PaymentStatusResponse {
  transactionId: number;
  amount: number;
  status: string;
  createdAt: string;
  isPaid: boolean;
}

class PaymentService {
  /**
   * Initiate a payment and get QR code
   */
  async initiatePayment(
    amount: number,
    description: string
  ): Promise<PaymentResponse> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/api/v1/payment/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to initiate payment");
    }

    return response.json();
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(transactionId: number): Promise<PaymentStatusResponse> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${API_URL}/api/v1/payment/status/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to check payment status");
    }

    return response.json();
  }

  /**
   * Get bank account info
   */
  async getBankInfo() {
    const response = await fetch(`${API_URL}/api/v1/payment/bank-info`);

    if (!response.ok) {
      throw new Error("Failed to fetch bank info");
    }

    return response.json();
  }
}

export const paymentService = new PaymentService();
