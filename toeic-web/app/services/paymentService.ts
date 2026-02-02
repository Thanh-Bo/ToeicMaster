import axiosClient from "./axiosClient";

interface PaymentPackage {
  name: string;
  price: number;
  duration: number;
  pricePerMonth: number;
}

interface CreatePaymentResponse {
  success: boolean;
  message: string;
  paymentUrl: string;
  orderId: number;
}

interface PaymentStatusResponse {
  paymentId: number;
  transactionNo: string;
  status: string;
  message: string;
  createdAt: string;
  paidAt?: string;
  amount: number;
  packageType: string;
}

export const paymentService = {
  // Lấy danh sách gói
  getPackages: async (): Promise<PaymentPackage[]> => {
    try {
      const response = await axiosClient.get<PaymentPackage[]>("/payment/packages");
      return response.data;
    } catch (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }
  },

  // Tạo payment link
  createPayment: async (packageType: string): Promise<CreatePaymentResponse> => {
    try {
      const response = await axiosClient.post<CreatePaymentResponse>("/payment/create", {
        packageType,
        durationMonths: 0, // Backend sẽ set dựa trên packageType
        amount: 0, // Backend sẽ set
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  },

  // Kiểm tra status
  getPaymentStatus: async (paymentId: number): Promise<PaymentStatusResponse> => {
    try {
      const response = await axiosClient.get<PaymentStatusResponse>(
        `/payment/${paymentId}/status`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting payment status:", error);
      throw error;
    }
  },
};
