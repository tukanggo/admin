import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSalesOrderMatchTable1668023948869 implements MigrationInterface {
    name = 'updateSalesOrderMatchTable1668023948869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` ADD \`productId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` ADD \`expiryDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` ADD CONSTRAINT \`FK_cd627a82b0a90b6076fc5e6031e\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP FOREIGN KEY \`FK_cd627a82b0a90b6076fc5e6031e\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`expiryDate\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`productId\``);
    }

}
