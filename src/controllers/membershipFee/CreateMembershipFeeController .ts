import { Request, Response } from 'express';
import { CreateMembershipFeeService } from '../../services/membershipFee/CreateMembershipFeeService ';

class CreateMembershipFeeController {
  async handle(req: Request, res: Response) {
    const { userId } = req.body;

    const createMembershipFeeService = new CreateMembershipFeeService();

    try {
      const membershipFee = await createMembershipFeeService.execute(userId);

      return res.json(membershipFee);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateMembershipFeeController };
