import { Request, Response } from 'express';
import { ListBirthdayUserService } from '../../services/user/ListByBirthdayUserService';

class ListByBirthdayUserController {
  async handle(req: Request, res: Response) {
    const listBirthdayUserService = new ListBirthdayUserService();

    const users = await listBirthdayUserService.execute();

    const photoUsers = users.map(user => {
      const fileUrl = `http://localhost:3333/files/${user.profile}`;
      return { ...user, profile: fileUrl };
    });

    return res.json(photoUsers);
  }
}

export { ListByBirthdayUserController };