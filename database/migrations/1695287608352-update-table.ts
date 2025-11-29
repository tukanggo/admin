import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1695287608352 implements MigrationInterface {
  name = 'updateTable1695287608352';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`settings\` ADD \`creditForQuotation\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`settings\` ADD \`creditForInstantBook\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`settings\` ADD \`quotationTukangCharges\` decimal(12,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`settings\` ADD \`instantBookTukangCharges\` decimal(12,2) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`settings\` DROP COLUMN \`instantBookTukangCharges\``);
    await queryRunner.query(`ALTER TABLE \`settings\` DROP COLUMN \`quotationTukangCharges\``);
    await queryRunner.query(`ALTER TABLE \`settings\` DROP COLUMN \`creditForInstantBook\``);
    await queryRunner.query(`ALTER TABLE \`settings\` DROP COLUMN \`creditForQuotation\``);
  }
}
