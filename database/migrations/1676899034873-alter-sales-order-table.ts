import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterSalesOrderTable1676899034873 implements MigrationInterface {
  name = 'alterSalesOrderTable1676899034873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`name\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`address\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`placeName\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`addressDetail\` text NULL`);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`remarks\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`remarks\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`addressDetail\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`placeName\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`address\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`name\``);
  }
}
