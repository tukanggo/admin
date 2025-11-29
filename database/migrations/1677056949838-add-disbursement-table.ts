import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDisbursementTable1677056949838 implements MigrationInterface {
  name = 'addDisbursementTable1677056949838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`disbursements\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`serviceProviderId\` int UNSIGNED NULL, \`bankName\` varchar(200) NULL, \`bankAccountNo\` varchar(50) NULL, \`bankReceiver\` varchar(200) NULL, \`receipt\` text NULL, \`total\` decimal(12,2) NULL, \`status\` enum ('PENDING', 'DISBURSED', 'REJECT') NULL, \`remarks\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`disbursementId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`bankName\` varchar(200) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` ADD \`bankAccountNo\` varchar(50) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` ADD \`bankReceiver\` varchar(200) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` ADD \`bankSupportingDocument\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`disbursements\` ADD CONSTRAINT \`FK_2f339e82443e8bca5df8cc46941\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_7029b17a5f99503dfb8fa6d70de\` FOREIGN KEY (\`disbursementId\`) REFERENCES \`disbursements\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_7029b17a5f99503dfb8fa6d70de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`disbursements\` DROP FOREIGN KEY \`FK_2f339e82443e8bca5df8cc46941\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` DROP COLUMN \`bankSupportingDocument\``,
    );
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`bankReceiver\``);
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`bankAccountNo\``);
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`bankName\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`disbursementId\``);
    await queryRunner.query(`DROP TABLE \`disbursements\``);
  }
}
