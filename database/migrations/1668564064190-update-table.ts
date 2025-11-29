import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1668564064190 implements MigrationInterface {
    name = 'updateTable1668564064190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`customerMemberTier\` enum ('BASIC', 'SILVER', 'GOLD', 'PLATINUM') NULL DEFAULT 'BASIC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`customerMemberTier\``);
    }

}
