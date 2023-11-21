import prismaClient from "../../prisma";

interface AttendanceRequest{
    gameId: string;
}

class ListAttendanceService{
  async execute({ gameId }: AttendanceRequest){
    
    const findByGameId = await prismaClient.attendance.findMany({
      where:{
        gameId: gameId
      }
    })

    return findByGameId;

  }
}

export { ListAttendanceService }