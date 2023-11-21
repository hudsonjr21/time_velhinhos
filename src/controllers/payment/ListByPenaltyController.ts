import {Request, Response} from 'express'
import { ListByPenaltyService } from '../../services/payment/ListByPenaltyService';


class ListByPenaltyController{
  async handle(req: Request, res: Response){
    const penaltyTypeId = req.query.penaltyTypeId as string;

    const listByPenalty = new ListByPenaltyService();

    const payment = await listByPenalty.execute({
        penaltyTypeId
    });

    return res.json(payment);

  }
}

export { ListByPenaltyController }