import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compare, genSalt, hash } from "bcryptjs";
import { UserEntity } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { AuthRegisterDTO } from "./dto/auth-register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  createToken(user: UserEntity) {
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
    const user = await this.userRepository.findOneBy({ email });
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

      await this.userRepository.update(id, { password: hashedPassword });

      const user = await this.userService.show(id);

      return this.createToken(user);
    } catch (error) {}
  }

  async forget(email: string) {
    const user = await this.userRepository.findOneBy({ email });
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
