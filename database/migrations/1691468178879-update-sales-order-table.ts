import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSalesOrderTable1691468178879 implements MigrationInterface {
  name = 'updateSalesOrderTable1691468178879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`productType\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`productType\``);
  }
}
