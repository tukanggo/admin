import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSalesOrderQuotationTable1675712648236 implements MigrationInterface {
  name = 'addSalesOrderQuotationTable1675712648236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sales_order_quotations\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`salesOrderId\` int UNSIGNED NULL, \`serviceProviderId\` int UNSIGNED NULL, \`quotationUrl\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_quotations\` ADD CONSTRAINT \`FK_4e4dc8314e7978da31b9d406cd1\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_quotations\` ADD CONSTRAINT \`FK_153258d322e6cb2bac3c50c9ffb\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_order_quotations\` DROP FOREIGN KEY \`FK_153258d322e6cb2bac3c50c9ffb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_quotations\` DROP FOREIGN KEY \`FK_4e4dc8314e7978da31b9d406cd1\``,
    );
    await queryRunner.query(`DROP TABLE \`sales_order_quotations\``);
  }
}
