import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSalesOrderServiceProofTable1678423502179 implements MigrationInterface {
  name = 'addSalesOrderServiceProofTable1678423502179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sales_order_service_proofs\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`salesOrderId\` int UNSIGNED NULL, \`imageUrl\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_service_proofs\` ADD CONSTRAINT \`FK_46652566db0df8f319895ee0828\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_order_service_proofs\` DROP FOREIGN KEY \`FK_46652566db0df8f319895ee0828\``,
    );
    await queryRunner.query(`DROP TABLE \`sales_order_service_proofs\``);
  }
}
