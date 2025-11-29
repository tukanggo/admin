import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSpTable1706781018828 implements MigrationInterface {
    name = 'updateSpTransactionTable1706781018829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers_transactions\` ADD \`remark\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers_transactions\` DROP COLUMN \`remark\``);
    }

}
