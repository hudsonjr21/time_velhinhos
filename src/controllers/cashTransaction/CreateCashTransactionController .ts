import { Request, Response } from 'express';
import { CreateCashTransactionService } from '../../services/cashTransaction/CreateCashTransactionService ';


class CreateCashTransactionController {
  async handle(req: Request, res: Response) {
    const { description, amount, transactionDate, userId, paymentId } = req.body;

    const createCashTransactionService = new CreateCashTransactionService();

    try {
      const cashTransaction = await createCashTransactionService.execute({
        description,
        amount,
        transactionDate,
        userId,
        paymentId,
      });

      return res.json(cashTransaction);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateCashTransactionController };
