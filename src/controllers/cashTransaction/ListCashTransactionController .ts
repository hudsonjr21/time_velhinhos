import { Request, Response } from 'express';
import { ListCashTransactionService } from '../../services/cashTransaction/ListCashTransactionService ';

class ListCashTransactionController {
  async handle(req: Request, res: Response) {
    const listCashTransactionService = new ListCashTransactionService();

    try {
      const cashTransactions = await listCashTransactionService.execute();

      return res.json(cashTransactions);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListCashTransactionController };
