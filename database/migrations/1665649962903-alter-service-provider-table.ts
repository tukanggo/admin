import { MigrationInterface, QueryRunner } from "typeorm";

export class alterServiceProviderTable1665649962903 implements MigrationInterface {
    name = 'alterServiceProviderTable1665649962903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`companyDocument\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`companyDocument\``);
    }

}
