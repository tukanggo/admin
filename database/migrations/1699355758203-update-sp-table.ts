import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSpTable1699355758203 implements MigrationInterface {
  name = 'updateSpTable1699355758203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_provider_sales_orders\` DROP COLUMN \`paymentStatus\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_provider_sales_orders\` ADD \`paymentStatus\` enum ('PENDING_PAYMENT', 'PROCESSING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL DEFAULT 'PENDING_PAYMENT' after grandTotal`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_provider_sales_orders\` ADD \`refNo\` varchar(20) NULL after serviceProviderId`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_provider_sales_orders\` DROP COLUMN \`paymentStatus\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_provider_sales_orders\` ADD \`paymentStatus\` enum ('PENDING_PAYMENT', 'PROCESSING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL DEFAULT 'PENDING_PAYMENT'`,
    );
    await queryRunner.query(`ALTER TABLE \`service_provider_sales_orders\` DROP COLUMN \`refNo\``);
  }
}
