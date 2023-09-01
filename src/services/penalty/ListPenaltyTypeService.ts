import prismaClient from "../../prisma";

class ListPenaltyTypeService{
  async execute(){

    const penaltyType = await prismaClient.penaltyType.findMany({
      select:{
        id: true,
        name: true,
        description: true,
        amount: true,
      }
    })

    return penaltyType;

  }
}

export { ListPenaltyTypeService }