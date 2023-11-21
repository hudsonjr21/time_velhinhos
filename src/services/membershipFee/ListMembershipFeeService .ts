import prismaClient from '../../prisma';

class ListMembershipFeeService {
  async execute() {
    try {
      const membershipFees = await prismaClient.membershipFee.findMany();

      return membershipFees;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to list membership fees');
    } finally {
      await prismaClient.$disconnect();
    }
  }
}

export { ListMembershipFeeService };
