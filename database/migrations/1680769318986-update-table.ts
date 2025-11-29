import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1680769318986 implements MigrationInterface {
    name = 'updateTable1680769318986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`serviceLocation\` varchar(200) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`serviceLocation\``);
    }

}
