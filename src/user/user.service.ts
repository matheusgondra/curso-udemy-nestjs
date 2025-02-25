import { Injectable, NotFoundException } from "@nestjs/common";
import { genSalt, hash } from "bcrypt";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor() {}

  async create(data: CreateUserDTO) {
    const salt = await genSalt();
    data.password = await hash(data.password, salt);
    return this.prisma.user.create({ data });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async update(data: UpdateUserDTO | UpdatePartialUserDTO, id: number) {
    await this.exists(id);

    const salt = await genSalt();
    data.password = await hash(data.password, salt);

    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: { id }
    });
  }

  async exists(id: number) {
    const user = await this.prisma.user.count({
      where: { id }
    });
    if (!user) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}
