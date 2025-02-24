import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ParamId } from "src/decorators/param-id.decorator";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard, RoleGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }

  @Roles(Role.ADMIN)
  @Get()
  async list() {
    return this.userService.list();
  }

  @Roles(Role.ADMIN)
  @Get(":id")
  async show(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Roles(Role.ADMIN)
  @Put(":id")
  async update(@Body() body: UpdateUserDTO, @ParamId() id: number) {
    return this.userService.update(body, id);
  }

  @Roles(Role.ADMIN)
  @Patch(":id")
  async updatePartial(@Body() body: UpdatePartialUserDTO, @ParamId() id: number) {
    return this.userService.update(body, id);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
