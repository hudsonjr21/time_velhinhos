import { Request, Response } from 'express';
import { ListUserService } from '../../services/user/ListUserService';

class ListUserController {
  async handle(req: Request, res: Response) {
    const listUserService = new ListUserService();

    const users = await listUserService.execute();

    const photoUsers = users.map(user => {
      const fileUrl = `http://localhost:3333/files/${user.profile}`;
      return { ...user, profile: fileUrl };
    });

    return res.json(photoUsers);
  }
}

export { ListUserController };