import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1668367786337 implements MigrationInterface {
    name = 'updateTable1668367786337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`serviceProviderId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_86be4f629603df8bd2e8c25de42\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_86be4f629603df8bd2e8c25de42\``);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`serviceProviderId\``);
    }

}
