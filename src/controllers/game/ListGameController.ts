import { Request, Response } from 'express';
import { ListGameService } from '../../services/game/ListGameService';

class ListGameController {
  async handle(req: Request, res: Response) {
    const listGameService = new ListGameService();

    try {
      const games = await listGameService.execute();

      return res.json(games);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { ListGameController };
