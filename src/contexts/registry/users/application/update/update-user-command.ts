import { Command } from "@/contexts/shared/domain/command";

type Params = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];
};

export class UpdateUserCommand extends Command {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];

  constructor({ id, name, email, password, roles }: Params) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
