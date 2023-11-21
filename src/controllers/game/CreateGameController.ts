import { Request, Response } from 'express';
import { CreateGameService } from '../../services/game/CreateGameService';

class CreateGameController {
  async handle(req: Request, res: Response) {
    const { date, location } = req.body;

    const createGameService = new CreateGameService();

    try {
      const game = await createGameService.execute({ date, location });

      return res.json(game);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { CreateGameController };
