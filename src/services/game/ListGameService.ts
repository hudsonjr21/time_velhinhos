import prismaClient from '../../prisma';

class ListGameService {
  async execute() {
    try {
      const games = await prismaClient.game.findMany({
        orderBy: {
          date: 'desc', // Ordenar por data em ordem decrescente
        },
        include: {
          attendances: {
            where: { isAttending: true || false}, // Apenas jogadores que confirmaram presença
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  // Outros campos do usuário, se necessário
                },
              },
            },
          },
        },
      });

      return games;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to list games');
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export { ListGameService };
