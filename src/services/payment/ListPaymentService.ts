import prismaClient from "../../prisma";

class ListPaymentService{
  async execute(){

    const payment = await prismaClient.payment.findMany({
      select:{
        userId: true,
        amount: true,
        penaltyTypeId: true,
        description: true,
        membershipFeeId: true,
      }
    })

    return payment;

  }
}

export { ListPaymentService }