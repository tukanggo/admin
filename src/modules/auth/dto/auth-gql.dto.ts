import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateMeDTO {
  @Field({ nullable: true }) email: string;
  @Field({ nullable: true }) name: string;
}

@InputType()
export class UpdatePasswordDTO {
  @Field({ nullable: true }) currentPassword: string;
  @Field({ nullable: true }) newPassword: string;
  @Field({ nullable: true }) confirmPassword: string;
}
@InputType()
export class changePasswordDTO {
  @Field({ nullable: true }) id: number;
  @Field({ nullable: true }) newPassword: string;
}
