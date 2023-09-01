import prismaClient from "../../prisma";

interface UserRequest{
    userId: string;
}

class ListByUserService{
  async execute({ userId }: UserRequest){
    
    const findByTeam = await prismaClient.payment.findMany({
      where:{
        userId: userId
      }
    })

    return findByTeam;

  }
}

export { ListByUserService }