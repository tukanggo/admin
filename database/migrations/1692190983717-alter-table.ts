import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTable1692190983717 implements MigrationInterface {
    name = 'alterTable1692190983717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_galleries\` DROP FOREIGN KEY \`FK_962c747ab8355588ab3eb655c15\``);
        await queryRunner.query(`ALTER TABLE \`product_galleries\` ADD CONSTRAINT \`FK_962c747ab8355588ab3eb655c15\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_galleries\` DROP FOREIGN KEY \`FK_962c747ab8355588ab3eb655c15\``);
        await queryRunner.query(`ALTER TABLE \`product_galleries\` ADD CONSTRAINT \`FK_962c747ab8355588ab3eb655c15\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

}
