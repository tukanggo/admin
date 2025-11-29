import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSalesOrderTable1691473344410 implements MigrationInterface {
  name = 'updateSalesOrderTable1691473344410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`producePrice\` decimal(12,2) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`producePrice\``);
  }
}
