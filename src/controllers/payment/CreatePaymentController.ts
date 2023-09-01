import { Request, Response } from 'express';
import { CreatePaymentService } from '../../services/payment/CreatePaymentService';

class CreatePaymentController {
  async handle(req: Request, res: Response) {
    const { userId, amount, penaltyTypeId, paymentDate, description, membershipFeeId } = req.body;

    const createPaymentService = new CreatePaymentService();

    try {
      const payment = await createPaymentService.execute({
        userId,
        amount,
        penaltyTypeId,
        paymentDate,
        description,
        membershipFeeId,
      });

      return res.json(payment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreatePaymentController };
