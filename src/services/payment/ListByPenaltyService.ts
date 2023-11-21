import prismaClient from "../../prisma";

interface PenaltyRequest{
    penaltyTypeId: string;
}

class ListByPenaltyService{
  async execute({ penaltyTypeId }: PenaltyRequest){
    
    const findByPenalty = await prismaClient.payment.findMany({
      where:{
        penaltyTypeId: penaltyTypeId
      }
    })

    return findByPenalty;

  }
}

export { ListByPenaltyService }