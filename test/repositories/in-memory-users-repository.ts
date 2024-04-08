import {UsersRepository} from '@/domain/main/application/repositories/users-repository';
import {User} from '@/domain/main/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = this.items.find((item) => item.username === username);

    if (!user) {
      return null;
    }

    return user;
  }
}
