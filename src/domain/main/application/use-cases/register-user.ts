import {User} from '@/domain/main/enterprise/entities/user';
import {Either, left, right} from '@/core/either';
import {UserRole} from '@/core/enum/user-role.enum';
import {UserAlreadyExistsError} from './errors/user-already-exists-error';
import {Injectable} from '@nestjs/common';
import {UsersRepository} from '../repositories/users-repository';
import {HashGenerator} from '../cryptography/hash-generator';

interface RegisterUserUseCaseRequest {
  username: string;
  password: string;
  role: UserRole;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;
@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    username,
    password,
    role
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameUsername =
      await this.usersRepository.findByUsername(username);

    if (userWithSameUsername) {
      return left(new UserAlreadyExistsError(username));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      username,
      password: hashedPassword,
      role
    });

    await this.usersRepository.create(user);

    return right({
      user
    });
  }
}
