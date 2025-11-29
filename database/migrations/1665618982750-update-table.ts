import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1665618982750 implements MigrationInterface {
    name = 'updateTable1665618982750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_options\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`productOptionCategoryId\` int UNSIGNED NULL, \`name\` varchar(200) NULL, \`price\` decimal(12,2) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_options_categories\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`productId\` int UNSIGNED NULL, \`arrangement\` int(3) UNSIGNED NULL, \`name\` varchar(200) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sales_order_galleries\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`salesOrderId\` int UNSIGNED NULL, \`imageUrl\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD \`productOptionId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`remark\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_103d6b69be8ec657ac7741b28cb\` FOREIGN KEY (\`productOptionId\`) REFERENCES \`product_options\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`product_options\` ADD CONSTRAINT \`FK_d20c89f8c43fbcb3f6cffa8a96e\` FOREIGN KEY (\`productOptionCategoryId\`) REFERENCES \`product_options_categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`product_options_categories\` ADD CONSTRAINT \`FK_1edcc5625e1314b5d8b6eba51cb\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`sales_order_galleries\` ADD CONSTRAINT \`FK_ec210d0ea9bcc4680d415e59fc6\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_galleries\` DROP FOREIGN KEY \`FK_ec210d0ea9bcc4680d415e59fc6\``);
        await queryRunner.query(`ALTER TABLE \`product_options_categories\` DROP FOREIGN KEY \`FK_1edcc5625e1314b5d8b6eba51cb\``);
        await queryRunner.query(`ALTER TABLE \`product_options\` DROP FOREIGN KEY \`FK_d20c89f8c43fbcb3f6cffa8a96e\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_103d6b69be8ec657ac7741b28cb\``);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`remark\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP COLUMN \`productOptionId\``);
        await queryRunner.query(`DROP TABLE \`sales_order_galleries\``);
        await queryRunner.query(`DROP TABLE \`product_options_categories\``);
        await queryRunner.query(`DROP TABLE \`product_options\``);
    }

}
