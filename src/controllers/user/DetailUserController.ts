import {Request, Response} from 'express'
import { DetailUserService } from '../../services/user/DetailUserService'

class DetailuserController{
  async handle(req: Request, res: Response){

    const user_id = req.user_id;

    const detailUserService = new DetailUserService();

    const user = await detailUserService.execute(user_id);
    const fileUrl = `http://localhost:3333/files/${user.profile}`;
    const updatedUser = { ...user, profile: fileUrl };

    return res.json(updatedUser);

  }
}

export { DetailuserController }