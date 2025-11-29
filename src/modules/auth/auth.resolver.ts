/* eslint-disable import/no-internal-modules */
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthGuard } from 'src/guards/auth.guard';
import { AdminDTO } from '@modules/admins/admins.entity';
import { AdminsEntity, CustomersEntity } from 'src/entities';
import { GqlAuthUser } from './auth.decorator';
import * as DTO from './dto/auth-gql.dto';
import { comparePassword, hashPassword } from '@providers/bcrypt.service';
import { AuthData } from '@types';
import { Repository } from 'typeorm';

@UseGuards(GqlAuthGuard)
@Resolver(() => AdminDTO)
export class AuthResolver {
  constructor(
    @InjectRepository(AdminsEntity) private Admin: Repository<AdminsEntity>,
    @InjectRepository(CustomersEntity) private User: Repository<CustomersEntity>,
  ) {}

  @Query(() => AdminDTO)
  getMeInfo(@GqlAuthUser() admin: AuthData) {
    return this.Admin.findOne({ where: { id: admin.id } });
  }

  @Mutation(() => AdminDTO)
  async updateMeInfo(@Args('input') input: DTO.UpdateMeDTO, @GqlAuthUser() admin: AuthData) {
    const me = await this.Admin.findOne({ where: { id: admin.id } });
    if (!me) throw new Error('Account not found');
    me.email = input.email;
    me.name = input.name;
    await this.Admin.save(me);
    return this.Admin.findOne({ where: { id: admin.id } });
  }

  @Mutation(() => AdminDTO)
  async changeMyPassword(
    @Args('input') input: DTO.UpdatePasswordDTO,
    @GqlAuthUser() admin: AuthData,
  ) {
    const me = await this.Admin.findOne({ where: { id: admin.id } });
    if (!me) throw new Error('Account not found');
    if (input.confirmPassword !== input.newPassword)
      throw new Error('New password and confirmation password does not match.');
    const valid = await comparePassword(input.currentPassword, me.password);
    if (!valid) throw new Error('Incorrect old password.');
    me.password = hashPassword(input.currentPassword);
    await this.Admin.save(me);
    return this.Admin.findOne({ where: { id: admin.id } });
  }

  @Mutation(() => AdminDTO)
  async superAdminChangePassword(
    @Args('input') input: DTO.changePasswordDTO,
    @GqlAuthUser() admin: AuthData,
  ) {
    const me = await this.Admin.findOne({ where: { id: admin.id } });
    if (me.type !== 'SUPER_ADMIN') throw new BadRequestException(`Insufficient permissions`);
    const user = await this.Admin.findOne({ where: { id: input.id } });
    if (!user) throw new Error('Account not found');
    user.password = hashPassword(input.newPassword);
    await this.Admin.save(user);
    return this.Admin.findOne({ where: { id: input.id } });
  }
}
