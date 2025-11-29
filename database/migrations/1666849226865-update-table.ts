import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1666849226865 implements MigrationInterface {
    name = 'updateTable1666849226865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_providers_ratings\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`serviceProviderId\` int UNSIGNED NULL, \`salesOrderId\` int UNSIGNED NULL, \`rate\` int(1) UNSIGNED NULL, \`comment\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` ADD CONSTRAINT \`FK_00664599af29950b18d4031d5d8\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` ADD CONSTRAINT \`FK_047624473832d2f5f4a0c38929d\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` DROP FOREIGN KEY \`FK_047624473832d2f5f4a0c38929d\``);
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` DROP FOREIGN KEY \`FK_00664599af29950b18d4031d5d8\``);
        await queryRunner.query(`DROP TABLE \`service_providers_ratings\``);
    }

}
