import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import { compare, genSalt, hash } from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  createToken(user: User) {
    return this.jwtService.sign(
      {
        name: user.name,
        email: user.email
      },
      {
        expiresIn: "7 days",
        subject: String(user.id),
        issuer: "login",
        audience: "users"
      }
    );
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: "users",
        issuer: "login"
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Email ou senha incorretos");
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Email ou senha incorretos");
    }

    return this.createToken(user);
  }

  async reset(password: string, token: string) {
    // validar token
    try {
      const { id } = this.jwtService.verify(token, {
        issuer: "forget",
        audience: "users"
      });

      if (isNaN(Number(id))) {
        throw new BadRequestException("Token inválido");
      }

      const salt = await genSalt(12);
      const hashedPassword = await hash(password, salt);

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword
        }
      });

      return this.createToken(user);
    } catch (error) {}
  }

  async forget(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      throw new UnauthorizedException("Email incorreto");
    }

    const token = this.jwtService.sign(
      {
        id: user.id
      },
      {
        expiresIn: "30 minutes",
        subject: String(user.id),
        issuer: "forget",
        audience: "users"
      }
    );

    await this.mailerService.sendMail({
      subject: "Recuperação de senha",
      to: email,
      template: "forget",
      context: {
        name: user.name,
        link: token
      }
    });

    return true;
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
