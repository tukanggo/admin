import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSalesOrderTable1691473469201 implements MigrationInterface {
    name = 'updateSalesOrderTable1691473469201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` CHANGE \`producePrice\` \`productPrice\` decimal(12,2) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` CHANGE \`productPrice\` \`producePrice\` decimal(12,2) NULL`);
    }

}
