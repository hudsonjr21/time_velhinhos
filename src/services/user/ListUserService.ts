import prismaClient from "../../prisma";

class ListUserService{
  async execute(){

    const penaltyType = await prismaClient.user.findMany({
      select:{
        id: true,
        name: true,
        cellNumber: true,
        birthday: true,
        profile: true,
        role: true,
      }
    })

    return penaltyType;

  }
}

export { ListUserService }