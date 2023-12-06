import { Request, Response } from 'express';
import { CreateMembershipFeeService } from '../../services/membershipFee/CreateMembershipFeeService ';

class CreateMembershipFeeController {
  async handle(req: Request, res: Response) {
    const { userId, month, year } = req.body;

    const createMembershipFeeService = new CreateMembershipFeeService();

    if (!req.file) {
      throw new Error('Error uploading file');
    } else {
      const { originalname, filename: receiptPayment } = req.file;

      try {
        const membershipFee = await createMembershipFeeService.execute({
          userId,
          month,
          year,
          receiptPayment
        });
        return res.json(membershipFee);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  }
}

export { CreateMembershipFeeController };
