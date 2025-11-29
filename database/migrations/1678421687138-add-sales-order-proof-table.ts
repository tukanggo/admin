import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSalesOrderProofTable1678421687138 implements MigrationInterface {
  name = 'addSalesOrderProofTable1678421687138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sales_order_proofs\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`salesOrderId\` int UNSIGNED NULL, \`imageUrl\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_proofs\` ADD CONSTRAINT \`FK_cc705e662ad9515bc7141e03006\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_order_proofs\` DROP FOREIGN KEY \`FK_cc705e662ad9515bc7141e03006\``,
    );
    await queryRunner.query(`DROP TABLE \`sales_order_proofs\``);
  }
}
