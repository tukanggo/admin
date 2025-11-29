import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1665043504432 implements MigrationInterface {
  name = 'alterTable1665043504432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_addresses\` ADD \`placeName\` varchar(255) NULL`,
    );
    await queryRunner.query(`DROP TABLE \`promotions\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer_addresses\` DROP COLUMN \`placeName\``);
    await queryRunner.query(
      `CREATE TABLE \`promotions\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`category\` enum ('SUBCATEGORIES', 'PRESET_CRITERIA') NULL, \`name\` varchar(255) NULL, \`description\` text NULL, \`originalPrice\` decimal(12,2) NULL, \`discountedPrice\` decimal(12,2) NULL, \`quantity\` int NULL, \`validity\` datetime NULL, \`startDate\` date NULL, \`endDate\` date NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }
}
