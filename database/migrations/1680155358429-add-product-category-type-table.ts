import { MigrationInterface, QueryRunner } from "typeorm";

export class addProductCategoryTypeTable1680155358429 implements MigrationInterface {
    name = 'addProductCategoryTypeTable1680155358429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_categories_types\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`productCategoryId\` int UNSIGNED NULL, \`type\` enum ('RFQ', 'INSTANT_BOOKING', 'PROMOTIONAL') NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` ADD CONSTRAINT \`FK_c2be2f31836557fbef574ae8bfc\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` DROP FOREIGN KEY \`FK_c2be2f31836557fbef574ae8bfc\``);
        await queryRunner.query(`DROP TABLE \`product_categories_types\``);
    }

}
