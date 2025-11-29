import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTable1681443082404 implements MigrationInterface {
    name = 'alterTable1681443082404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`customerMemberTier\` \`customerMemberTier\` enum ('BASIC', 'SILVER', 'GOLD', 'PLATINUM') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`customerMemberTier\` \`customerMemberTier\` enum ('BASIC', 'SILVER', 'GOLD', 'PLATINUM') NULL DEFAULT 'BASIC'`);
    }

}
