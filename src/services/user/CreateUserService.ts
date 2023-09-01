import prismaClient from '../../prisma';
import { parseISO, differenceInYears } from 'date-fns';
import { hash } from 'bcryptjs';

interface UserRequest {
  name: string;
  email: string;
  password: string;
  cellNumber: string;
  birthday: string;
  profile: string;
}

class CreateUserService {
  async execute({
    name,
    email,
    password,
    cellNumber,
    birthday,
    profile,
  }: UserRequest) {
    // Calcula a idade do usuário com base na data de nascimento
    const birthDate = parseISO(birthday);
    const currentDate = new Date();

    const ageInMilliseconds = differenceInYears(currentDate, birthDate);

    // Verifica se a idade está dentro dos limites (5 a 100 anos)
    if (ageInMilliseconds < 5 || ageInMilliseconds > 100) {
      throw new Error('Data de aniversário inválida.');
    }

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
        cellNumber: cellNumber,
        role: 'user',
        birthday: birthday,
        profile: profile,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cellNumber: true,
        role: true,
        birthday: true,
        profile: true,
      },
    });

    return user;
  }
}

export { CreateUserService };