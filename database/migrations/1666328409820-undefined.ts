import { MigrationInterface, QueryRunner } from "typeorm";

export class undefined1666328409820 implements MigrationInterface {
    name = 'undefined1666328409820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_items\` DROP FOREIGN KEY \`FK_bbac0e96531dcbbf429ad4290be\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`active\` tinyint(1) NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`product_items\` ADD CONSTRAINT \`FK_bbac0e96531dcbbf429ad4290be\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_items\` DROP FOREIGN KEY \`FK_bbac0e96531dcbbf429ad4290be\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`active\``);
        await queryRunner.query(`ALTER TABLE \`product_items\` ADD CONSTRAINT \`FK_bbac0e96531dcbbf429ad4290be\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

}
