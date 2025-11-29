import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1664898261838 implements MigrationInterface {
  name = 'updateTable1664898261838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`customer_products\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`customerId\` int UNSIGNED NULL, \`productId\` int UNSIGNED NULL, \`serviceProviderId\` int UNSIGNED NULL, \`categoryId\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sales_order_matches\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sales_order_matches_items\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`type\` enum ('TUKANG_GO', 'REQUEST_BOOKING', 'RFQ') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD CONSTRAINT \`FK_565f577093760c6c7ce8de9d137\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD CONSTRAINT \`FK_910cebcb5d32747cf51375efae0\` FOREIGN KEY (\`categoryId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` DROP FOREIGN KEY \`FK_910cebcb5d32747cf51375efae0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` DROP FOREIGN KEY \`FK_565f577093760c6c7ce8de9d137\``,
    );
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`type\``);
    await queryRunner.query(`DROP TABLE \`sales_order_matches_items\``);
    await queryRunner.query(`DROP TABLE \`sales_order_matches\``);
    await queryRunner.query(`DROP TABLE \`customer_products\``);
  }
}
