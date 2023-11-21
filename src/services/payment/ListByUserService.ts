import prismaClient from "../../prisma";

interface UserRequest{
    userId: string;
}

class ListByUserService{
  async execute({ userId }: UserRequest){
    
    const findByUser = await prismaClient.payment.findMany({
      where:{
        userId: userId
      }
    })

    return findByUser;

  }
}

export { ListByUserService }