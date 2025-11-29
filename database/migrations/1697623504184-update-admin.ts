import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateAdmin1697623504184 implements MigrationInterface {
  name = 'updateAdmin1697623504184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`admins\` CHANGE \`type\` \`type\` enum ('STAFF', 'SUPER_ADMIN', 'ADMIN') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`admins\` CHANGE \`type\` \`type\` enum ('STAFF', 'SUPER_ADMIN') NULL`,
    );
  }
}
