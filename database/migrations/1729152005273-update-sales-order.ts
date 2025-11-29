import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSalesOrder1729152005273 implements MigrationInterface {
    name = 'UpdateSalesOrder1729152005273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`contactName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`contactNo\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`contactNo\``);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`contactName\``);
    }

}
