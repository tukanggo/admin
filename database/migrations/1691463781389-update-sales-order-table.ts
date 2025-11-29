import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSalesOrderTable1691463781389 implements MigrationInterface {
  name = 'updateSalesOrderTable1691463781389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`productName\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`productCategory\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`productCategory\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`productName\``);
  }
}
