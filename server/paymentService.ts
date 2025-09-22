import Razorpay from 'razorpay';
import crypto from 'crypto';
import { storage } from './storage';

class PaymentService {
  private razorpay: Razorpay | null = null;
  private initialized = false;

  private initialize() {
    if (this.initialized) return;
    
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn('Razorpay credentials not configured - payment features will be disabled');
      this.initialized = true;
      return;
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    this.initialized = true;
  }

  private ensureInitialized() {
    this.initialize();
    if (!this.razorpay) {
      throw new Error('Razorpay service not available - credentials not configured');
    }
  }

  async createOrder(amount: number, currency: string = 'INR', receiptId?: string) {
    this.ensureInitialized();
    
    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: receiptId || `receipt_${Date.now()}`,
      };

      const order = await this.razorpay!.orders.create(options);
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    try {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error('Razorpay key secret not configured');
      }

      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpaySignature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  async getPaymentDetails(paymentId: string) {
    this.ensureInitialized();
    
    try {
      const payment = await this.razorpay!.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Failed to fetch payment details');
    }
  }

  async refundPayment(paymentId: string, amount?: number) {
    this.ensureInitialized();
    
    try {
      const refundOptions: any = {};
      if (amount) {
        refundOptions.amount = amount * 100; // Convert to paise
      }

      const refund = await this.razorpay!.payments.refund(paymentId, refundOptions);
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }

  async processPaymentSuccess(
    paymentId: string,
    orderId: string,
    signature: string,
    dbPaymentId: string
  ) {
    try {
      // Verify signature
      if (!this.verifyPaymentSignature(orderId, paymentId, signature)) {
        throw new Error('Invalid payment signature');
      }

      // Get payment details from Razorpay
      const paymentDetails = await this.getPaymentDetails(paymentId);

      // Update payment in database
      const updatedPayment = await storage.updatePayment(dbPaymentId, {
        status: 'paid',
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
      });

      return {
        success: true,
        payment: updatedPayment,
        razorpayDetails: paymentDetails,
      };
    } catch (error) {
      console.error('Error processing payment success:', error);
      
      // Mark payment as failed
      await storage.updatePayment(dbPaymentId, {
        status: 'failed',
      });

      throw new Error('Payment verification failed');
    }
  }
}

export const paymentService = new PaymentService();