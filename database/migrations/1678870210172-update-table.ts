import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1678870210172 implements MigrationInterface {
  name = 'updateTable1678870210172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`service_provider_sales_orders\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`serviceProviderId\` int UNSIGNED NULL, \`grandTotal\` decimal(12,2) NULL, \`paymentUrl\` text NULL, \`remark\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`service_providers_transactions\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`disbursementId\` int UNSIGNED NULL, \`serviceProviderId\` int UNSIGNED NULL, \`serviceProviderSalesOrderId\` int UNSIGNED NULL, \`type\` enum ('TOP_UP', 'SERVICE_TRANSACTION') NULL, \`amount\` decimal(12,2) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`serviceProviderTransactionId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_65dc0a012493d612bd590956988\` FOREIGN KEY (\`serviceProviderTransactionId\`) REFERENCES \`service_providers_transactions\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_provider_sales_orders\` ADD CONSTRAINT \`FK_2c0c90db7db3e2e837124663da4\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers_transactions\` ADD CONSTRAINT \`FK_14f5f26595268f2113e840a3fa5\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers_transactions\` ADD CONSTRAINT \`FK_850573ddbe1006e8e7a585d4d9f\` FOREIGN KEY (\`serviceProviderSalesOrderId\`) REFERENCES \`service_provider_sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers_transactions\` ADD CONSTRAINT \`FK_5c6d21a263bb0a7eb2756d90e9f\` FOREIGN KEY (\`disbursementId\`) REFERENCES \`disbursements\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_providers_transactions\` DROP FOREIGN KEY \`FK_5c6d21a263bb0a7eb2756d90e9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers_transactions\` DROP FOREIGN KEY \`FK_850573ddbe1006e8e7a585d4d9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers_transactions\` DROP FOREIGN KEY \`FK_14f5f26595268f2113e840a3fa5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_provider_sales_orders\` DROP FOREIGN KEY \`FK_2c0c90db7db3e2e837124663da4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_65dc0a012493d612bd590956988\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP COLUMN \`serviceProviderTransactionId\``,
    );
    await queryRunner.query(`DROP TABLE \`service_providers_transactions\``);
    await queryRunner.query(`DROP TABLE \`service_provider_sales_orders\``);
  }
}
