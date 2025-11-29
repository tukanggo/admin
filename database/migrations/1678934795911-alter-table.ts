import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1678934795911 implements MigrationInterface {
  name = 'alterTable1678934795911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`isApprove\` tinyint(1) NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`rejectRemark\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`rejectRemark\``);
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`isApprove\``);
  }
}
