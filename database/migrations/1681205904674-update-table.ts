import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1681205904674 implements MigrationInterface {
    name = 'updateTable1681205904674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`arrangement\` int(3) UNSIGNED NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`arrangement\``);
    }

}
