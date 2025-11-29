import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1665047255864 implements MigrationInterface {
  name = 'alterTable1665047255864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`description\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`description\``);
  }
}
