import prismaClient from '../../prisma';

interface CreatePaymentRequest {
  userId: string;
  amount: number;
  penaltyTypeId?: string;
  paymentDate: Date;
  description?: string;
  membershipFeeId?: string;
}

class CreatePaymentService {
  async execute({
    userId,
    amount,
    penaltyTypeId,
    paymentDate,
    description,
    membershipFeeId,
  }: CreatePaymentRequest) {

    try {
      // Verificar se o usuário existe
      const user = await prismaClient.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new Error('User not found');
      }

      // Verificar se o tipo de multa existe (se foi informado)
      const penaltyType = penaltyTypeId
        ? await prismaClient.penaltyType.findUnique({ where: { id: penaltyTypeId } })
        : null;

      // Verificar se a taxa de associação existe (se foi informada)
      const membershipFee = membershipFeeId
        ? await prismaClient.membershipFee.findUnique({ where: { id: membershipFeeId } })
        : null;

      // Criar o pagamento
      const payment = await prismaClient.payment.create({
        data: {
          userId,
          amount,
          penaltyTypeId,
          paymentDate,
          description,
          membershipFeeId,
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
