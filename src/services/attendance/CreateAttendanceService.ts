import prismaClient from '../../prisma';

interface CreateAttendanceRequest {
  userId: string;
  gameId: string;
  isAttending: boolean;
}

class CreateAttendanceService {
  async execute({ userId, gameId, isAttending }: CreateAttendanceRequest) {
    try {
      // Verificar se o usuário existe
      const user = await prismaClient.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new Error('User not found');
      }

      // Verificar se o jogo existe
      const game = await prismaClient.game.findUnique({ where: { id: gameId } });

      if (!game) {
        throw new Error('Game not found');
      }

      // Verificar se já existe uma presença registrada para o usuário e o jogo
      const existingAttendance = await prismaClient.attendance.findFirst({
        where: {
          userId,
          gameId,
        },
      });

      if (existingAttendance) {
        // Se já existe uma presença, verificar se a confirmação é a mesma
        if (existingAttendance.isAttending === isAttending) {
          return { error: isAttending ? 'Presença já confirmada' : 'Presença já não confirmada' };
        }

        // Se a confirmação for diferente, atualize a presença
        const updatedAttendance = await prismaClient.attendance.update({
          where: { id: existingAttendance.id },
          data: {
            isAttending,
          },
        });

        return updatedAttendance;
      } else {
        // Se não existe presença, crie uma nova
        const attendance = await prismaClient.attendance.create({
          data: {
            userId,
            gameId,
            isAttending,
          },
        });

        return attendance;
      }
    } catch (error) {
      console.error('Error:', error);
      return { error: 'Failed to create or update attendance' };
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export { CreateAttendanceService };