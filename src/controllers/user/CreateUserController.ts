import { Request, Response } from 'express';
import { CreateUserService } from '../../services/user/CreateUserService';

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, cellNumber, birthday } = req.body;

    const createUserService = new CreateUserService();

    if (!req.file) {
      throw new Error('Error uploading file');
    } else {
      const { originalname, filename: profile } = req.file;

      const user = await createUserService.execute({
        name,
        email,
        password,
        cellNumber,
        birthday,
        profile,
      });

      return res.json(user);
    }
  }
}

export { CreateUserController };
