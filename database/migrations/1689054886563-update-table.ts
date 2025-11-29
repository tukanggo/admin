import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1689054886563 implements MigrationInterface {
  name = 'updateTable1689054886563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`quantity\` int NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`quantity\``);
  }
}
