import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async createToken() {
    // return this.jwtService.sign();
  }

  async checkToken() {
    // return this.jwtService.verify();
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email, password }
    });
    if (!user) {
      throw new UnauthorizedException("Email ou senha incorretos");
    }

    return true;
  }

  async reset(password: string, token: string) {
    // validar token
    const id = 0;

    await this.prisma.user.update({
      where: { id },
      data: { password }
    });
  }

  async forget(email: string) {}
}
