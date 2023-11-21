import { Request, Response } from 'express';
import { ListMembershipFeeService } from '../../services/membershipFee/ListMembershipFeeService ';

class ListMembershipFeeController {
  async handle(req: Request, res: Response) {
    const listMembershipFeeService = new ListMembershipFeeService();

    try {
      const membershipFees = await listMembershipFeeService.execute();

      return res.json(membershipFees);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListMembershipFeeController };
