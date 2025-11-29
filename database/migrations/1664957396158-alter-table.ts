import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTable1664957396158 implements MigrationInterface {
    name = 'alterTable1664957396158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_06446057131907564f6a41e28d\` ON \`sales_orders\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`salesOrdersId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` ADD \`salesOrdersId\` int UNSIGNED NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_06446057131907564f6a41e28d\` ON \`sales_orders\` (\`salesOrderMatchId\`)`);
    }

}
