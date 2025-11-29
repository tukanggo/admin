import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTable1681115615250 implements MigrationInterface {
    name = 'alterTable1681115615250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_addresses\` ADD \`area\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`area\` varchar(255) NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`area\``);
        await queryRunner.query(`ALTER TABLE \`customer_addresses\` DROP COLUMN \`area\``);
    }

}
