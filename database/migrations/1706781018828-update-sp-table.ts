import { MigrationInterface, QueryRunner } from "typeorm";

export class updateSpTable1706781018828 implements MigrationInterface {
    name = 'updateSpTable1706781018828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`isBanned\` tinyint(1) NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`isBanned\``);
    }

}
