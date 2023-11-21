import prismaClient from '../../prisma';

class ListCashTransactionService {
  async execute() {
    try {
      const cashTransactions = await prismaClient.cashTransaction.findMany();

      return cashTransactions;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to list cash transactions');
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export { ListCashTransactionService };
