import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string;

  @Transform(({ value }) => new Date(value))
  @IsDateString()
  @IsOptional()
  birthAt: Date;

  @IsEnum(Role)
  @IsOptional()
  role: number;
}
