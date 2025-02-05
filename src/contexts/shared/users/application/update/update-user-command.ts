import { Command } from "@/shared/domain/command";

type Params = {
  id: string;
  email?: string;
  password?: string;
  roles?: string[];
};

export class UpdateUserCommand extends Command {
  id: string;
  email?: string;
  password?: string;
  roles?: string[];

  constructor({ id, email, password, roles }: Params) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
