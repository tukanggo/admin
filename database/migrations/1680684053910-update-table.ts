import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1680684053910 implements MigrationInterface {
    name = 'updateTable1680684053910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`banners\` ADD \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` ADD \`arrangement\` int(3) UNSIGNED NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories\` DROP COLUMN \`arrangement\``);
        await queryRunner.query(`ALTER TABLE \`banners\` DROP COLUMN \`arrangement\``);
    }

}
