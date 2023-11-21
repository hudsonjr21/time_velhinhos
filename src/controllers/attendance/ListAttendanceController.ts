import {Request, Response} from 'express'
import { ListAttendanceService } from '../../services/attendance/ListAttendanceService';


class ListAttendanceController{
  async handle(req: Request, res: Response){
    const gameId= req.query.gameId as string;

    const listAttendance = new ListAttendanceService();

    const attendance = await listAttendance.execute({
        gameId
    });

    return res.json(attendance);

  }
}

export { ListAttendanceController }