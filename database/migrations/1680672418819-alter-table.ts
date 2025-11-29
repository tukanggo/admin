import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1680672418819 implements MigrationInterface {
  name = 'alterTable1680672418819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`paymentStatus\` \`paymentStatus\` enum ('PENDING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL DEFAULT 'PENDING_PAYMENT'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` CHANGE \`paymentStatus\` \`paymentStatus\` enum ('PENDING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL`,
    );
  }
}
