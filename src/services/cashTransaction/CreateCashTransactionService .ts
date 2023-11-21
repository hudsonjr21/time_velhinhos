import prismaClient from '../../prisma';

interface CreateCashTransactionRequest {
  description: string;
  amount: number;
  transactionDate: Date;
  userId?: string;
  paymentId?: string;
}

class CreateCashTransactionService {
  async execute({
    description,
    amount,
    transactionDate,
    userId,
    paymentId,
  }: CreateCashTransactionRequest) {
    try {
      const cashTransaction = await prismaClient.cashTransaction.create({
        data: {
          description,
          amount,
          transactionDate,
          userId,
          paymentId,
        },
      });

      return cashTransaction;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to create cash transaction');
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export { CreateCashTransactionService };
