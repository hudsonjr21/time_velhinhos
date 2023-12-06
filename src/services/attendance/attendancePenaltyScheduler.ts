import prismaClient from '../../prisma';
import { CreatePaymentService } from '../payment/CreatePaymentService';
import { ListAttendanceService } from './ListAttendanceService'; // Importe o serviço de listagem de presença

async function applyPenaltiesForAttendance() {
  try {
    const currentDate = new Date();
    const startOfTomorrow = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    const startOfDayAfterTomorrow = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2);
    
    console.log('Buscando jogos entre:', startOfTomorrow, 'e', startOfDayAfterTomorrow);

    const games = await prismaClient.game.findMany({
      where: {
        date: {
          gte: startOfTomorrow,
          lt: startOfDayAfterTomorrow,
        },
      },
    });

    console.log('Jogos encontrados:', games.length);

    const listAttendanceService = new ListAttendanceService(); // Instancie o serviço de listagem de presença

    // Buscar todos os usuários do banco de dados
    const allUsers = await prismaClient.user.findMany();

    for (const user of allUsers) {
      const { id: userId } = user;

      let userPresent = false;
      
      for (const game of games) {
        const { id: gameId } = game;

        // Use o serviço para buscar os usuários que confirmaram presença neste jogo
        const usersWithAttendance = await listAttendanceService.execute({ gameId });
        console.log('QTD Usuários com nome na lista:', usersWithAttendance.length);

        // Verifica se o usuário está presente na lista do jogo
        const isUserInAttendanceList = usersWithAttendance.some((attendance) => attendance.userId === userId);
        if (isUserInAttendanceList) {
          userPresent = true; // Usuário está presente na lista
          break; // Interrompe a verificação dos jogos restantes se o usuário está na lista de pelo menos um jogo
        }
      }

      // Se o usuário não estiver na lista de nenhum jogo, aplica-se a multa
      if (!userPresent) {
        const createPaymentService = new CreatePaymentService();

        const penaltyTypeId = '5a75dafb-781b-41ab-8118-85bda6d570eb';
        const penaltyType = await prismaClient.penaltyType.findUnique({
          where: {
            id: penaltyTypeId,
          },
        });

        if (penaltyType) {
          console.log('Aplicando multa para o usuário:', userId);
          await createPaymentService.execute({
            userId,
            amount: penaltyType.amount,
            description: 'Multa por ausência na lista de presença',
            penaltyTypeId,
            paymentDate: currentDate,
          });
        }
      }
    }
  } catch (error) {
    console.error('Erro ao aplicar multas:', error);
  }
}

export { applyPenaltiesForAttendance };