import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterSalesOrderStatus1679903604018 implements MigrationInterface {
  name = 'alterSalesOrderStatus1679903604018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('MATCHING', 'PENDING_PAYMENT', 'READY_TO_REDEEM', 'PENDING_SERVICE', 'SP_IN_PROGRESS', 'IN_PROGRESS', 'SP_COMPLETE', 'COMPLETE', 'CANCELLED') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('MATCHING', 'PENDING_PAYMENT', 'READY_TO_REDEEM', 'PENDING_SERVICE', 'SP_IN_PROGRESS', 'IN_PROGRESS', 'SP_COMPLETE', 'COMPLETE') NULL`,
    );
  }
}
