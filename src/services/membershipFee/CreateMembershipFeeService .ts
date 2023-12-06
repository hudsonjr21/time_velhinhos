import prismaClient from '../../prisma';
import cron from 'node-cron';
import { scheduleMonthlyFees } from './monthlyFeeScheduler';
import { ListPenaltyTypeService } from '../penalty/ListPenaltyTypeService';

// Agendando a execução da função scheduleMonthlyFees para o dia 11 de cada mês às 00:00
cron.schedule('0 0 11 * *', async () => {
    try {
        console.log('Verificando se há mensalidades a serem pagas...');
        await scheduleMonthlyFees();
    } catch (error) {
        console.error('Erro ao verificar as taxas mensais:', error);
    }
});

interface CreateMembershipFeeRequest {
  userId: string;
  month?: number;
  year?: number;
  receiptPayment: string;
}

class CreateMembershipFeeService {
  async execute({ userId, month, year, receiptPayment }: CreateMembershipFeeRequest) {
    try {
      const currentDate = new Date();
      const currentMonth = month || currentDate.getMonth() + 1;
      const currentYear = year || currentDate.getFullYear();

      // Verifica se já existe uma mensalidade para o usuário neste mês e ano
      const existingMembershipFee = await prismaClient.membershipFee.findFirst({
        where: {
          userId,
          month: Number(currentMonth),
          year: Number(currentYear),
        },
      });

      if (existingMembershipFee) {
        // Se a mensalidade já está paga, retorna a mensalidade existente
        if (existingMembershipFee.isPaid) {
          console.log(`Mensalidade ${Number(currentMonth)}/${Number(currentYear)} já paga!`);
          return existingMembershipFee;
        }

        // Calcula a data limite para pagamento da mensalidade
        const latePaymentDate = new Date(currentYear, currentMonth - 2, 10); // Dia 10 do mês anterior

        // Se a data atual for após a data limite, aplica multa e atualiza a mensalidade para paga
        if (currentDate > latePaymentDate) {
          let totalAmount = existingMembershipFee.amount

          const updatedMembershipFee = await prismaClient.membershipFee.update({
            where: { id: existingMembershipFee.id },
            data: { isPaid: true, receiptPayment, amount: totalAmount },
          });

          // Cria o pagamento e a transação de caixa associada ao pagamento
          await this.createPaymentAndCashTransaction(updatedMembershipFee, totalAmount, userId, currentDate);
          console.log(`Mensalidade ${Number(currentMonth)}/${Number(currentYear)} paga com multa!`);
          return updatedMembershipFee;
        }

        // Retorna a mensalidade existente se o pagamento não estiver atrasado
        return existingMembershipFee;
      } else {
        // Busca as informações das taxas do banco de dados
        const listPenaltyService = new ListPenaltyTypeService();
        const penaltyTypes = await listPenaltyService.execute();

        // Encontrar a taxa desejada pelo ID
        const desiredPenaltyType = penaltyTypes.find(type => type.id === '0420576e-d5a2-4da2-9c75-c14f1784100b');

        if (desiredPenaltyType) {
          // Use o valor da taxa selecionada para a mensalidade
          let feeAmount = desiredPenaltyType.amount;

          // Calcula a data limite para pagamento da mensalidade
          const latePaymentDate = new Date(currentYear, currentMonth - 1, 10);

          // Verifica se a mensalidade foi paga após o prazo de pagamento
          if (currentDate > latePaymentDate) {
            feeAmount += 10.0;
            console.log(`Mensalidade ${Number(currentMonth)}/${Number(currentYear)} paga com multa!`);
          } else {
            console.log(`Mensalidade ${Number(currentMonth)}/${Number(currentYear)} paga sem multa!`);
          }

      // Cria uma nova mensalidade e define como paga
      const newMembershipFee = await prismaClient.membershipFee.create({
        data: {
          userId,
          month: Number(currentMonth),
          year: Number(currentYear),
          amount: feeAmount,
          isPaid: true,
          receiptPayment,
          paymentDate: currentDate,
          description: `Membership fee for ${currentMonth}/${currentYear}`,
        },
      });

      // Cria o pagamento e a transação de caixa associada ao pagamento
      await this.createPaymentAndCashTransaction(newMembershipFee, feeAmount, userId, currentDate);

      return newMembershipFee;
    } else {
      // Trate o caso em que a taxa desejada não foi encontrada
      throw new Error('Taxa não encontrada');
    }
        }
      } catch (error) {
        console.error(error);
        throw new Error('Erro ao pagar mensalidade!');
      }
  }

  // Método para criar o pagamento e a transação de caixa
  async createPaymentAndCashTransaction(membershipFee: any, amount: number, userId: string, currentDate: Date) {
    // Cria um novo pagamento associado à taxa de associação
    const payment = await prismaClient.payment.create({
      data: {
        userId,
        amount,
        paymentDate: currentDate,
        description: `Membership fee for ${membershipFee.month}/${membershipFee.year}`,
        membershipFeeId: membershipFee.id,
      },
    });

    // Cria uma transação de caixa associada ao pagamento
    const cashTransaction = await prismaClient.cashTransaction.create({
      data: {
        userId,
        description: `Payment for membership fee for ${membershipFee.month}/${membershipFee.year}`,
        amount,
        transactionDate: currentDate,
        paymentId: payment.id,
      },
    });
  }
}

export { CreateMembershipFeeService };