import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { join } from "node:path";
import { User } from "src/decorators/user.decorator";
import { FileService } from "src/file/file.service";
import { AuthGuard } from "src/guards/auth.guard";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {}

  @Post("login")
  async login(@Body() { email, password }: AuthLoginDTO) {
    const accessToken = await this.authService.login(email, password);
    return { accessToken };
  }

  @Post("register")
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post("forget")
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post("reset")
  async reset(@Body() body: AuthResetDTO) {
    return this.authService.reset(body.password, body.token);
  }

  @UseGuards(AuthGuard)
  @Post("me")
  async me(@User() user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthGuard)
  @Post("photo")
  async uploadPhoto(
    @User()
    user,

    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: "image/jpeg" }),
          new MaxFileSizeValidator({ maxSize: 1024 * 20 })
        ]
      })
    )
    photo: Express.Multer.File
  ) {
    const [, extension] = photo.originalname.split(".");
    const path = join(__dirname, "..", "..", "storage", "photos", `photo-${user.id}.${extension}`);

    try {
      await this.fileService.upload(photo, path);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return { success: true };
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: "photo",
        maxCount: 1
      },
      {
        name: "documents",
        maxCount: 10
      }
    ])
  )
  @UseGuards(AuthGuard)
  @Post("files-fields")
  async uploadFiles(
    @User() user,
    @UploadedFiles() files: { photo: Express.Multer.File; documents: Express.Multer.File[] }
  ) {
    return {
      photo: files.photo,
      documents: files.documents
    };
  }
}
