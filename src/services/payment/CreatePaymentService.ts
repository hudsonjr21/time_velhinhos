import prismaClient from '../../prisma';

interface CreatePaymentRequest {
  userId: string;
  amount: number; // Adicionando o campo 'amount' no request
  description: string; // Adicionando o campo 'description' no request
  penaltyTypeId?: string;
  paymentDate: Date;
  membershipFeeId?: string;
}

class CreatePaymentService {
  async execute({
    userId,
    amount,
    description,
    penaltyTypeId,
    paymentDate,
    membershipFeeId,
  }: CreatePaymentRequest) {
    try {
      const user = await prismaClient.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new Error('User not found');
      }

      let finalUserId = userId;
      let finalAmount = amount;
      let finalDescription = description;
      
      if (penaltyTypeId) {
        const penaltyType = await prismaClient.penaltyType.findUnique({ where: { id: penaltyTypeId } });
        if (penaltyType) {
          finalAmount = penaltyType.amount;
          finalDescription = penaltyType.name || 'Payment for penalty';
        }
      } else if (membershipFeeId) {
        const membershipFee = await prismaClient.membershipFee.findUnique({ where: { id: membershipFeeId } });
        if (membershipFee) {
          finalUserId = membershipFee.userId;
          finalAmount = membershipFee.amount;
          finalDescription = `Payment for ${membershipFee.month}/${membershipFee.year} membership fee`;
        }
      }

      const payment = await prismaClient.payment.create({
        data: {
          userId: finalUserId,
          amount: finalAmount,
          penaltyTypeId,
          paymentDate,
          description: finalDescription,
          membershipFeeId,
        },
      });

      const cashTransaction = await prismaClient.cashTransaction.create({
        data: {
          userId: payment.userId,
          description: payment.description,
          amount: payment.amount,
          transactionDate: payment.paymentDate,
          paymentId: payment.id,
        },
      });

      return payment;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to create payment');
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export { CreatePaymentService };