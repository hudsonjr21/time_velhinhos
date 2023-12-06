import { Request, Response } from 'express';
import { UpdatePenaltyTypeService } from '../../services/penalty/UpdatePenaltyTypeService';

class UpdatePenaltyTypeController {
  async handle(req: Request, res: Response) {
    const { id, name, description, amount } = req.body;

    const updatePenaltyTypeService = new UpdatePenaltyTypeService();

    try {
      const updatePenaltyType = await updatePenaltyTypeService.execute({
        id,
        name,
        description,
        amount,
      });

      return res.json(updatePenaltyType);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
}
export { UpdatePenaltyTypeController };
