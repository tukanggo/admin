import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1670248727511 implements MigrationInterface {
    name = 'updateTable1670248727511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sales_order_matches_rejections\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`salesOrderMatchId\` int UNSIGNED NULL, \`rejectionReason\` text NULL, \`remark\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_items\` CHANGE \`arrangement\` \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_options_categories\` CHANGE \`arrangement\` \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_ratings\` CHANGE \`rate\` \`rate\` int(1) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`promo_codes\` CHANGE \`discountPercentage\` \`discountPercentage\` int(3) NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` CHANGE \`quantity\` \`quantity\` int(8) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` CHANGE \`rate\` \`rate\` int(1) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches_rejections\` ADD CONSTRAINT \`FK_4b2304ebd60503f2f3e56291d4f\` FOREIGN KEY (\`salesOrderMatchId\`) REFERENCES \`sales_order_matches\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_matches_rejections\` DROP FOREIGN KEY \`FK_4b2304ebd60503f2f3e56291d4f\``);
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` CHANGE \`rate\` \`rate\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` CHANGE \`quantity\` \`quantity\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`promo_codes\` CHANGE \`discountPercentage\` \`discountPercentage\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product_ratings\` CHANGE \`rate\` \`rate\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_options_categories\` CHANGE \`arrangement\` \`arrangement\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_items\` CHANGE \`arrangement\` \`arrangement\` int UNSIGNED NULL`);
        await queryRunner.query(`DROP TABLE \`sales_order_matches_rejections\``);
    }

}
