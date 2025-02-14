import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ParamId = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const id = context.switchToHttp().getRequest().params.id;
  return Number(id);
});
