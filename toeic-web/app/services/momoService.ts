import axiosClient from '@/app/services/axiosClient';

export interface PaymentPackage {
  name: string;
  price: number;
  duration: number;
  pricePerMonth: number;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  paymentUrl: string;
  qrCode?: string;
  deeplink?: string;
  orderId: number;
}

export interface PaymentStatusResponse {
  paymentId: number;
  transactionNo: string;
  status: string;
  message: string;
  createdAt: string;
  paidAt?: string;
  amount: number;
  packageType: string;
}

const paymentService = {
  // Lấy danh sách gói premium
  async getPackages(): Promise<PaymentPackage[]> {
    try {
      const response = await axiosClient.get('/payment/packages');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      throw error;
    }
  },

  // Tạo payment link MoMo
  async createPayment(packageType: string): Promise<CreatePaymentResponse> {
    try {
      const response = await axiosClient.post('/payment/create', {
        packageType,
        durationMonths: 1 // Will be overridden by backend based on package
      });

      console.log('Payment created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw error;
    }
  },

  // Lấy status của payment
  async getPaymentStatus(paymentId: number): Promise<PaymentStatusResponse> {
    try {
      const response = await axiosClient.get(`/payment/${paymentId}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }
};

export default paymentService;
