import prismaClient from '../../prisma';

interface UpdatePenaltyTypeRequest {
  id: string;
  name: string;
  description?: string;
  amount: number;
}

class UpdatePenaltyTypeService {
  async execute({
    id,
    name,
    description,
    amount,
  }: UpdatePenaltyTypeRequest) {
    const penaltyType = await prismaClient.penaltyType.findUnique({ where: { id } });

    if (!penaltyType) {
      throw new Error('User not found');
    }

    const updatedPenaltyType = await prismaClient.penaltyType.update({
      where: { id },
      data: {
        name,
        description,
        amount,
      },
      select: {
        id: true,
        name: true,
        description: true,
        amount: true,
      },
    });

    return updatedPenaltyType;
  }
}

export { UpdatePenaltyTypeService };
