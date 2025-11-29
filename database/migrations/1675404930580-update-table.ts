import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1675404930580 implements MigrationInterface {
  name = 'updateTable1675404930580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('MATCHING', 'PENDING_PAYMENT', 'READY_TO_REDEEM', 'PENDING_SERVICE', 'IN_PROGRESS', 'SP_COMPLETE', 'COMPLETE') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('PENDING', 'MATCHING', 'MATCHED', 'READY_TO_REDEEM', 'REDEEMED', 'PENDING_SERVICE', 'IN_PROGRESS', 'COMPLETE') NULL`,
    );
  }
}
