import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSpOrder1699351379627 implements MigrationInterface {
    name = 'updateSpOrder1699351379627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_provider_sales_orders\` ADD \`paymentStatus\` enum ('PENDING_PAYMENT', 'PROCESSING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL DEFAULT 'PENDING_PAYMENT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_provider_sales_orders\` DROP COLUMN \`paymentStatus\``);
    }

}
