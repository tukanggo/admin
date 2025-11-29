import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1688976058459 implements MigrationInterface {
  name = 'updateTable1688976058459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`paymentStatus\` \`paymentStatus\` enum ('PENDING_PAYMENT', 'PROCESSING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL DEFAULT 'PENDING_PAYMENT'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`paymentStatus\` \`paymentStatus\` enum ('PENDING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL DEFAULT 'PENDING_PAYMENT'`,
    );
  }
}
