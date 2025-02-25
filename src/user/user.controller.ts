import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
		console.log("body", body);
    return this.userService.create(body);
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(":id")
  async show(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Put(":id")
  async update(@Body() body: UpdateUserDTO, @ParamId() id: number) {
    return this.userService.update(body, id);
  }

  @Patch(":id")
  async updatePartial(@Body() body: UpdatePartialUserDTO, @ParamId() id: number) {
    return this.userService.update(body, id);
  }

  @Delete(":id")
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }
}
