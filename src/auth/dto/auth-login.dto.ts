import { IsEmail, IsString, Min } from "class-validator";

export class AuthLoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Min(6)
  password: string;
}
