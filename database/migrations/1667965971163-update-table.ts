import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1667965971163 implements MigrationInterface {
    name = 'updateTable1667965971163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`latitude\` decimal(8,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`longitude\` decimal(8,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`latitude\` decimal(8,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`longitude\` decimal(8,3) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`longitude\``);
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`latitude\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`longitude\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`latitude\``);
    }

}
