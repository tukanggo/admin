import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1677486443574 implements MigrationInterface {
  name = 'updateTable1677486443574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` ADD \`quotationFile\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('MATCHING', 'PENDING_PAYMENT', 'READY_TO_REDEEM', 'PENDING_SERVICE', 'SP_IN_PROGRESS', 'IN_PROGRESS', 'SP_COMPLETE', 'COMPLETE') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('MATCHING', 'PENDING_PAYMENT', 'READY_TO_REDEEM', 'PENDING_SERVICE', 'IN_PROGRESS', 'SP_COMPLETE', 'COMPLETE') NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`quotationFile\``);
  }
}
