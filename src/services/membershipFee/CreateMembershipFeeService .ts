import prismaClient from '../../prisma';

interface CreateMembershipFeeRequest {
  userId: string;
  month?: number;
  year?: number;
}

class CreateMembershipFeeService {
  async execute({ userId, month, year }: CreateMembershipFeeRequest) {
    try {
      const currentDate = new Date();
      const currentMonth = month || currentDate.getMonth() + 1;
      const currentYear = year || currentDate.getFullYear();
      const dayOfMonth = currentDate.getDate();

      const existingMembershipFee = await prismaClient.membershipFee.findFirst({
        where: {
          userId,
          month: currentMonth,
          year: currentYear,
        },
      });

      if (existingMembershipFee) {
        // Verifica se já existe uma mensalidade para o usuário neste mês e ano
        if (existingMembershipFee.isPaid) {
          // Se já está paga, alerta que a mensalidade já foi paga para este mês e ano
          console.log('Membership fee is already paid for this month/year');
          return existingMembershipFee;
        } else if (dayOfMonth <= 10) {
          // Se ainda não está paga e a data atual é até o dia 10, atualiza para paga
          const updatedMembershipFee = await prismaClient.membershipFee.update({
            where: { id: existingMembershipFee.id },
            data: { isPaid: true },
          });
          return updatedMembershipFee;
        }
      } else if (!existingMembershipFee && dayOfMonth <= 10) {
        // Se não existe e a data atual é até o dia 10, cria uma nova mensalidade
        let feeAmount = 20.0; // Valor fixo da taxa

        // Lógica para calcular o valor a pagar após o dia 10 do mês
        const latePaymentDate = new Date(currentYear, currentMonth - 1, 10); // Dia 10 do mês
        if (currentDate > latePaymentDate) {
          const lateMonths = Math.max(0, currentDate.getMonth() - latePaymentDate.getMonth());
          const lateFee = 10.0 * lateMonths;
          feeAmount += lateFee;
        }

        const isPaid = false; // Mensalidade não está paga ainda

        const newMembershipFee = await prismaClient.membershipFee.create({
          data: {
            userId,
            month: currentMonth,
            year: currentYear,
            amount: feeAmount,
            isPaid,
            paymentDate: currentDate,
            description: `Membership fee for ${currentMonth}/${currentYear}`,
          },
        });

        // Cria automaticamente um pagamento associado à taxa de associação
        const payment = await prismaClient.payment.create({
          data: {
            userId,
            amount: feeAmount,
            paymentDate: currentDate,
            description: `Membership fee for ${currentMonth}/${currentYear}`,
            membershipFeeId: newMembershipFee.id,
          },
        });

        // Cria automaticamente uma transação de caixa associada ao pagamento
        const cashTransaction = await prismaClient.cashTransaction.create({
          data: {
            userId,
            description: `Payment for membership fee for ${currentMonth}/${currentYear}`,
            amount: feeAmount,
            transactionDate: currentDate,
            paymentId: payment.id,
          },
        });

        return newMembershipFee;
      }

      // Retorna null caso não haja necessidade de criar ou atualizar uma mensalidade
      return null;
    } catch (error) {
      throw new Error('Failed to create/update membership fee');
    }
  }
}

export { CreateMembershipFeeService };