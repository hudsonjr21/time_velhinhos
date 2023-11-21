import prismaClient from '../../prisma';

interface CreateGameRequest {
  date: Date;
  location: string;
}

class CreateGameService {
  async execute({ date, location }: CreateGameRequest) {
    try {
      const game = await prismaClient.game.create({
        data: {
          date,
          location,
        },
      });

      return game;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Erro ao criar Partida!');
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export { CreateGameService };