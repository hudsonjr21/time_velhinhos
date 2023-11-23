import prismaClient from '../../prisma';

class ListBirthdayUserService {
  async execute() {
    const currentMonth = new Date().getMonth() + 1; // Obtém o mês atual

    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        cellNumber: true,
        birthday: true,
        profile: true,
        role: true,
      },
      where: {
        // Filtra apenas os usuários que fazem aniversário no mês atual
        birthday: {
          contains: `-${currentMonth.toString().padStart(2, '0')}-`,
        },
      },
    });

    return users;
  }
}

export { ListBirthdayUserService };
