import { Request, Response } from 'express';
import { CreateUserService } from '../../services/user/CreateUserService';

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, cellNumber, birthday } = req.body;

    const createUserService = new CreateUserService();

    let profile = null;
    if (req.file) {
      const { originalname, filename } = req.file;
      profile = filename;
    }

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

export { CreateUserController };
