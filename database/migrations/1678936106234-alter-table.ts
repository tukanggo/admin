import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1678936106234 implements MigrationInterface {
  name = 'alterTable1678936106234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`isApprove\` \`isApproved\` tinyint(1) NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`isApproved\` \`isApprove\` tinyint(1) NULL DEFAULT '0'`,
    );
  }
}
