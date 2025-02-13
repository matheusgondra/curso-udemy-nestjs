import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Controller("users")
export class UserController {
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return { body };
  }

  @Get()
  async list() {
    return { users: [] };
  }

  @Get(":id")
  async show(@Param("id", ParseIntPipe) id: number) {
    return { user: {}, id };
  }

  @Put(":id")
  async update(@Body() body: UpdateUserDTO, @Param("id", ParseIntPipe) id: number) {
    return {
      method: "PUT",
      body,
      id
    };
  }

  @Patch(":id")
  async updatePartial(@Body() body: UpdatePartialUserDTO, @Param("id", ParseIntPipe) id: number) {
    return {
      method: "PATCH",
      body,
      id
    };
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return {
      id
    };
  }
}
