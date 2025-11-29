import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTableProductItem1666244947022 implements MigrationInterface {
    name = 'updateTableProductItem1666244947022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_items\` ADD \`productId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`product_items\` ADD CONSTRAINT \`FK_bbac0e96531dcbbf429ad4290be\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_items\` DROP FOREIGN KEY \`FK_bbac0e96531dcbbf429ad4290be\``);
        await queryRunner.query(`ALTER TABLE \`product_items\` DROP COLUMN \`productId\``);
    }

}
