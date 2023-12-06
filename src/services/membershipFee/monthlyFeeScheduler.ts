import prismaClient from '../../prisma';
import { ListPenaltyTypeService } from '../penalty/ListPenaltyTypeService';

export async function scheduleMonthlyFees() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const users = await prismaClient.user.findMany(); // Busca todos os usuários

    // Busca as informações das taxas do banco de dados
    const listPenaltyService = new ListPenaltyTypeService();
    const penaltyTypes = await listPenaltyService.execute();

    // Percorre cada mês do ano atual
    for (let month = 1; month <= 12; month++) {
      // Para cada usuário, verifica se já existe uma mensalidade para o mês e ano atual
      for (const user of users) {
        const existingMembershipFee = await prismaClient.membershipFee.findFirst({
          where: {
            userId: user.id,
            month,
            year: currentYear,
          },
        });

        // Se não existe uma mensalidade para este usuário no mês atual
        if (!existingMembershipFee) {
          const latePaymentDate = new Date(currentYear, month - 1, 10);

          // Verifica se a data atual é após o dia 10 do mês
          if (currentDate > latePaymentDate) {
            // Encontrar a taxa desejada pelo ID
            const desiredPenaltyType = penaltyTypes.find(type => type.id === '0420576e-d5a2-4da2-9c75-c14f1784100b');

            if (desiredPenaltyType) {
              let feeAmount = desiredPenaltyType.amount; // Usar o valor da taxa selecionada para a mensalidade

              feeAmount += 10.0; // Adiciona multa, se aplicável

              // Cria a mensalidade com isPaid = false
              await prismaClient.membershipFee.create({
                data: {
                  userId: user.id,
                  month,
                  year: currentYear,
                  amount: feeAmount,
                  isPaid: false,
                  receiptPayment: '',
                  paymentDate: currentDate,
                  description: `Membership fee for ${month}/${currentYear}`,
                },
              });

              console.log(`Mensalidade atrasada do ${user.id} no mês ${month}/${currentYear} inserida no banco!`);
            } else {
              // Trate o caso em que a taxa desejada não foi encontrada
              throw new Error('Taxa não encontrada');
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao agendar mensalidades!');
  }
}