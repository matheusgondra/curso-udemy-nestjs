import { IsEmail, IsString, Length } from "class-validator";

export class AuthLoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}
