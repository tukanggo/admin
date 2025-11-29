import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1695014716466 implements MigrationInterface {
  name = 'updateTable1695014716466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`remark\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`remark\``);
  }
}
