import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1688965631997 implements MigrationInterface {
  name = 'updateTable1688965631997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`effectiveStartDate\` date NULL`);
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`effectiveEndDate\` date NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`effectiveEndDate\``);
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`effectiveStartDate\``);
  }
}
