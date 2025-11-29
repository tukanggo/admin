import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1673801622128 implements MigrationInterface {
  name = 'alterTable1673801622128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD \`type\` enum ('PENDING', 'ACCEPT', 'REJECT') NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('PENDING', 'MATCHING', 'MATCHED', 'READY_TO_REDEEM', 'REDEEMED', 'PENDING_SERVICE', 'IN_PROGRESS', 'COMPLETE') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`salesOrderStatus\` \`salesOrderStatus\` enum ('PENDING', 'READY_TO_REDEEM', 'REDEEMED', 'PENDING_SERVICE', 'IN_PROGRESS', 'COMPLETE') NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`type\``);
  }
}
