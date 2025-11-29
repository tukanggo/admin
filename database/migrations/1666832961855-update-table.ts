import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1666832961855 implements MigrationInterface {
    name = 'updateTable1666832961855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`customer_notifications\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`customerId\` int UNSIGNED NULL, \`title\` varchar(255) NULL, \`content\` text NULL, \`thumbnail\` text NULL, \`deeplink\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`productId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`isAdminProduct\` tinyint(1) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`areaOfService\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_7b3b507508cd0f86a5b2e923459\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`customer_notifications\` ADD CONSTRAINT \`FK_84774ef7d932ceecdeb03038978\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_notifications\` DROP FOREIGN KEY \`FK_84774ef7d932ceecdeb03038978\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_7b3b507508cd0f86a5b2e923459\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`areaOfService\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`isAdminProduct\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`productId\``);
        await queryRunner.query(`DROP TABLE \`customer_notifications\``);
    }

}
