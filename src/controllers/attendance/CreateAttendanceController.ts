import { Request, Response } from 'express';
import { CreateAttendanceService } from '../../services/attendance/CreateAttendanceService';

class CreateAttendanceController {
  async handle(req: Request, res: Response) {
    const { userId, gameId, isAttending } = req.body;

    const createAttendanceService = new CreateAttendanceService();

    try {
      const attendance = await createAttendanceService.execute({
        userId,
        gameId,
        isAttending,
      });

      return res.json(attendance);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateAttendanceController };
