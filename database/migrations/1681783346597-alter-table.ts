import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTable1681783346597 implements MigrationInterface {
    name = 'alterTable1681783346597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD \`isActive\` tinyint(1) NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP COLUMN \`isActive\``);
    }

}
