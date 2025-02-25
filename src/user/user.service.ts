import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { genSalt, hash } from "bcryptjs";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserEntity } from "./entity/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(data: CreateUserDTO) {
		const alreadyExist = await this.userRepository.findOneBy({ email: data.email });
		if (alreadyExist) {
			throw new BadRequestException(`O email ${data.email} já está em uso`);
		}

		const salt = await genSalt();
		data.password = await hash(data.password, salt);

		const user = this.userRepository.create({ ...data });
		await this.userRepository.save(user);
		return user;
  }

  async list() {
    // return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return this.userRepository.findOneBy({ id });
  }

  async update(data: UpdateUserDTO | UpdatePartialUserDTO, id: number) {
    await this.exists(id);

    const salt = await genSalt();
    data.password = await hash(data.password, salt);

    await this.userRepository.update(id, { ...data });
		return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);

		return this.userRepository.delete(id);
  }

  async exists(id: number) {
    const user = await this.userRepository.exists({ where: { id } });
    if (!user) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}	