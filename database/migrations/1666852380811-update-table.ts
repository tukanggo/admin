import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1666852380811 implements MigrationInterface {
  name = 'updateTable1666852380811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`type\` enum ('INSTANT_BOOKING', 'PROMOTIONAL', 'RFQ') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`type\` enum ('TUKANG_GO', 'REQUEST_BOOKING', 'RFQ') NULL`,
    );
  }
}
