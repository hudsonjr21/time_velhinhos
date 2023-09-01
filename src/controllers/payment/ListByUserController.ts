import {Request, Response} from 'express'
import { ListByUserService } from '../../services/payment/ListByUserService';

class ListByUserController{
  async handle(req: Request, res: Response){
    const userId = req.query.userId as string;

    const listByUser = new ListByUserService();

    const payment = await listByUser.execute({
        userId
    });

    return res.json(payment);

  }
}

export { ListByUserController }