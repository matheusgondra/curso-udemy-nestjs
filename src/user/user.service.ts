import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return this.prisma.user.create({
      data,
      omit: {
        password: true
      }
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async update(data: UpdateUserDTO | UpdatePartialUserDTO, id: number) {
    this.exists(id);

    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    this.exists(id);

    return this.prisma.user.delete({
      where: { id }
    });
  }

  async exists(id: number) {
    const user = await this.show(id);
    if (!user) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}
