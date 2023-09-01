import {Request, Response} from 'express'
import { ListPaymentService } from '../../services/payment/ListPaymentService';

class ListPaymentController{
  async handle(req: Request, res: Response){
    const listPaymentService = new ListPaymentService();

    const payment = await listPaymentService.execute();

    return res.json(payment);

  }
}

export { ListPaymentController }