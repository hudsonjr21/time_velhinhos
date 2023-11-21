import { Request, Response } from 'express';
import { UpdateUserService } from '../../services/user/UpdateUserService ';

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { user_id } = req; // Use user_id que foi definido pelo middleware isAuthenticated
    const { name, email, cellNumber } = req.body;

    const updateUserService = new UpdateUserService();

    if (!req.file) {
      throw new Error('Error uploading file');
    } else {
      const { originalname, filename: profile } = req.file;

    try {
      const updatedUser = await updateUserService.execute({
        id: user_id, // Use user_id
        name,
        email,
        cellNumber,
        profile,
        // currentPassword,
        // newPassword,
      });

      return res.json(updatedUser);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  }
}
export { UpdateUserController };
