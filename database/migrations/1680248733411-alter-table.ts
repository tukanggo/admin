import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTable1680248733411 implements MigrationInterface {
    name = 'alterTable1680248733411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` DROP FOREIGN KEY \`FK_c2be2f31836557fbef574ae8bfc\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` CHANGE \`status\` \`status\` enum ('PENDING', 'ACCEPT', 'REJECT', 'CANCELLED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` ADD CONSTRAINT \`FK_c2be2f31836557fbef574ae8bfc\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` DROP FOREIGN KEY \`FK_c2be2f31836557fbef574ae8bfc\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_matches\` CHANGE \`status\` \`status\` enum ('PENDING', 'ACCEPT', 'REJECT') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`product_categories_types\` ADD CONSTRAINT \`FK_c2be2f31836557fbef574ae8bfc\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`);
    }

}
