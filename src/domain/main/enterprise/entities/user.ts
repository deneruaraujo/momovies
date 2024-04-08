import {Entity} from '@/core/entities/entity';
import {UniqueEntityId} from '@/core/entities/unique-entity-id';
import {UserRole} from '@/core/enum/user-role.enum';

export interface UserProps {
  username: string;
  password: string;
  role: UserRole;
}

export class User extends Entity<UserProps> {
  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    const user = new User(props, id);

    return user;
  }
}
