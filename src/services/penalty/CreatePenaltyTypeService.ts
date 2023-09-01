import prismaClient from '../../prisma';

interface CreatePenaltyTypeRequest {
  name: string;
  description?: string;
  amount: number;
}

class CreatePenaltyTypeService {
  async execute({ name, description, amount }: CreatePenaltyTypeRequest) {
    const penaltyType = await prismaClient.penaltyType.create({
      data: {
        name,
        description,
        amount,
      },
    });

    return penaltyType;
  }
}

export { CreatePenaltyTypeService };
