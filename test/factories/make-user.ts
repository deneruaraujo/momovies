import {UniqueEntityId} from '@/core/entities/unique-entity-id';
import {UserRole} from '@/core/enum/user-role.enum';
import {User, UserProps} from '@/domain/main/enterprise/entities/user';
import {faker} from '@faker-js/faker';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId
) {
  const user = User.create(
    {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      role: UserRole.User,
      ...override
    },
    id
  );

  return user;
}
