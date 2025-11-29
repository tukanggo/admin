import { MigrationInterface, QueryRunner } from "typeorm";

export class Undefined1725536024463 implements MigrationInterface {
    name = 'Undefined1725536024463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` DROP FOREIGN KEY \`FK_c2be2f31836557fbef574ae8bfc\``);
        await queryRunner.query(`ALTER TABLE \`product_items\` DROP FOREIGN KEY \`FK_bbac0e96531dcbbf429ad4290be\``);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`disbursementStatus\` enum ('PENDING', 'DISBURSED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`disbursementDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`banners\` CHANGE \`arrangement\` \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`phoneNo\` \`phoneNo\` varchar(40) NULL`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` CHANGE \`arrangement\` \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_items\` CHANGE \`arrangement\` \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_options_categories\` CHANGE \`arrangement\` \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_ratings\` CHANGE \`rate\` \`rate\` int(1) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`arrangement\` \`arrangement\` int(3) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`promo_codes\` CHANGE \`discountPercentage\` \`discountPercentage\` int(3) NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` CHANGE \`quantity\` \`quantity\` int(8) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_provider_sales_orders\` DROP COLUMN \`refNo\``);
        await queryRunner.query(`ALTER TABLE \`service_provider_sales_orders\` ADD \`refNo\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` CHANGE \`rate\` \`rate\` int(1) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_288a740a8755e64f0e8026369cb\` FOREIGN KEY (\`referralId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` ADD CONSTRAINT \`FK_c2be2f31836557fbef574ae8bfc\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_items\` ADD CONSTRAINT \`FK_bbac0e96531dcbbf429ad4290be\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` ADD CONSTRAINT \`FK_cf50446d5a195174215d8288858\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_06446057131907564f6a41e28d4\` FOREIGN KEY (\`salesOrderMatchId\`) REFERENCES \`sales_order_matches\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_06446057131907564f6a41e28d4\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP FOREIGN KEY \`FK_cf50446d5a195174215d8288858\``);
        await queryRunner.query(`ALTER TABLE \`product_items\` DROP FOREIGN KEY \`FK_bbac0e96531dcbbf429ad4290be\``);
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` DROP FOREIGN KEY \`FK_c2be2f31836557fbef574ae8bfc\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_288a740a8755e64f0e8026369cb\``);
        await queryRunner.query(`ALTER TABLE \`service_providers_ratings\` CHANGE \`rate\` \`rate\` int(10) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`service_provider_sales_orders\` DROP COLUMN \`refNo\``);
        await queryRunner.query(`ALTER TABLE \`service_provider_sales_orders\` ADD \`refNo\` varchar(200) NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` CHANGE \`quantity\` \`quantity\` int(11) NULL`);
        await queryRunner.query(`ALTER TABLE \`promo_codes\` CHANGE \`discountPercentage\` \`discountPercentage\` int(11) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`arrangement\` \`arrangement\` int(10) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_ratings\` CHANGE \`rate\` \`rate\` int(10) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_options_categories\` CHANGE \`arrangement\` \`arrangement\` int(10) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_items\` CHANGE \`arrangement\` \`arrangement\` int(10) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_categories\` CHANGE \`arrangement\` \`arrangement\` int(10) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`phoneNo\` \`phoneNo\` varchar(40) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`banners\` CHANGE \`arrangement\` \`arrangement\` int(10) UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`disbursementDate\``);
        await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`disbursementStatus\``);
        await queryRunner.query(`ALTER TABLE \`product_items\` ADD CONSTRAINT \`FK_bbac0e96531dcbbf429ad4290be\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` ADD CONSTRAINT \`FK_c2be2f31836557fbef574ae8bfc\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`);
    }

}
