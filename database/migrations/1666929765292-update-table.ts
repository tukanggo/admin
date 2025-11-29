import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1666929765292 implements MigrationInterface {
    name = 'updateTable1666929765292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_notifications\` ADD \`isRead\` tinyint(1) NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_notifications\` DROP COLUMN \`isRead\``);
    }

}
