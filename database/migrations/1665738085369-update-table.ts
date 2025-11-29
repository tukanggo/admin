import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1665738085369 implements MigrationInterface {
    name = 'updateTable1665738085369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`address\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`address\``);
    }

}
