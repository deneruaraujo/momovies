import {UserRole} from 'src/core/enum/user-role.enum';
import {FakeHasher} from 'test/cryptography/fake-hasher';
import {InMemoryUsersRepository} from 'test/repositories/in-memory-users-repository';
import {RegisterUserUseCase} from './register-user';
import {makeUser} from 'test/factories/make-user';
import {UniqueEntityId} from '@/core/entities/unique-entity-id';
import {UserAlreadyExistsError} from './errors/user-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: RegisterUserUseCase;

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      username: 'John Doe',
      password: '123456',
      role: UserRole.User
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0]
    });
  });

  it('Should hash user password upon registration', async () => {
    const result = await sut.execute({
      username: 'John Doe',
      password: '123456',
      role: UserRole.User
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });

  it('Should not be able to register with the same username', async () => {
    const username = 'John Doe';

    await inMemoryUsersRepository.create(
      makeUser(
        {
          username
        },
        new UniqueEntityId('user-01')
      )
    );

    const result = await sut.execute({
      username: 'John Doe',
      password: '123456',
      role: UserRole.User
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
