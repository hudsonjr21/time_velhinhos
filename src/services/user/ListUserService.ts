import prismaClient from '../../prisma';

class ListUserService {
  async execute() {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        cellNumber: true,
        birthday: true,
        profile: true,
        role: true,
      },
    });

    // Ordenando os usuários por mês de aniversário
    const sortedUsers = users.sort((a, b) => {
      const monthA = new Date(a.birthday).getMonth();
      const monthB = new Date(b.birthday).getMonth();
      return monthA - monthB;
    });

    return sortedUsers;
  }
}

export { ListUserService };
