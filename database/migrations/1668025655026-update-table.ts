import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1668025655026 implements MigrationInterface {
    name = 'updateTable1668025655026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_providers_notifications\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`serviceProviderId\` int UNSIGNED NULL, \`title\` varchar(255) NULL, \`content\` text NULL, \`thumbnail\` text NULL, \`deeplink\` text NULL, \`isRead\` tinyint(1) NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_providers_notifications\` ADD CONSTRAINT \`FK_fa0b464a28a71b375f57fd057a6\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers_notifications\` DROP FOREIGN KEY \`FK_fa0b464a28a71b375f57fd057a6\``);
        await queryRunner.query(`DROP TABLE \`service_providers_notifications\``);
    }

}
