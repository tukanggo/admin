import { MigrationInterface, QueryRunner } from "typeorm";

export class addProductGallery1692181419071 implements MigrationInterface {
    name = 'addProductGallery1692181419071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product_galleries\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`productId\` int UNSIGNED NULL, \`imageUrl\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_galleries\` ADD CONSTRAINT \`FK_962c747ab8355588ab3eb655c15\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_galleries\` DROP FOREIGN KEY \`FK_962c747ab8355588ab3eb655c15\``);
        await queryRunner.query(`DROP TABLE \`product_galleries\``);
    }

}
