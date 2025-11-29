import { AdminsEntity } from '@entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1663053511947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.manager.getRepository(AdminsEntity);

    const user = userRepo.create({
      type: 'SUPER_ADMIN',
      email: 'admin@mail.com',
      password: '$2a$10$zCubTJJAd4aONY7TbKgvfekU.PuglRMnRSnAbfHQ1gwJL3P9Rruyq', // 1234
    });
    await userRepo.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userRepo = queryRunner.manager.getRepository(AdminsEntity);

    await userRepo.delete({
      type: 'SUPER_ADMIN',
      email: 'admin@mail.com',
    });
  }
}
