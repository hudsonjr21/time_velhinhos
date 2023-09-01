import { Request, Response } from 'express';
import { CreatePenaltyTypeService } from '../../services/penalty/CreatePenaltyTypeService';

class CreatePenaltyTypeController {
  async handle(req: Request, res: Response) {
    const { name, description, amount } = req.body;

    const createPenaltyTypeService = new CreatePenaltyTypeService();

    try {
      const penaltyType = await createPenaltyTypeService.execute({
        name,
        description,
        amount,
      });

      return res.json(penaltyType);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreatePenaltyTypeController };
