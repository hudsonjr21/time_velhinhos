import {Request, Response} from 'express'
import { ListPenaltyTypeService } from '../../services/penalty/ListPenaltyTypeService';

class ListPenaltyTypeController{
  async handle(req: Request, res: Response){
    const listPenaltyTypeService = new ListPenaltyTypeService();

    const penaltyType = await listPenaltyTypeService.execute();

    return res.json(penaltyType);

  }
}

export { ListPenaltyTypeController }