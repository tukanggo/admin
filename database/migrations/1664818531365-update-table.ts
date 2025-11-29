import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1664818531365 implements MigrationInterface {
  name = 'updateTable1664818531365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`serviceProviderId\` int UNSIGNED NULL, \`categoryId\` int UNSIGNED NULL, \`name\` varchar(255) NULL, \`thumbnail\` text NULL, \`duration\` varchar(100) NULL, \`originalPrice\` decimal(12,2) NULL, \`discount\` int NULL DEFAULT '0', \`retailPrice\` decimal(12,2) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_categories\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NULL, \`thumbnail\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_items\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`arrangement\` int(3) UNSIGNED NULL, \`name\` text NULL, \`price\` decimal(12,2) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_ratings\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`productId\` int UNSIGNED NULL, \`rate\` int(1) UNSIGNED NULL, \`comment\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`search_histories\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`customerId\` int UNSIGNED NULL, \`keyword\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`service_providers\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`profilePicture\` text NULL, \`companyName\` varchar(255) NULL, \`companySSM\` varchar(100) NULL, \`fullName\` varchar(255) NULL, \`jobTitle\` varchar(255) NULL, \`phoneCountryCode\` varchar(10) NULL, \`phoneNo\` varchar(40) NULL, \`email\` varchar(200) NULL, \`password\` text NULL, \`resetPasswordToken\` varchar(10) NULL, UNIQUE INDEX \`IDX_14d1adea0db135f924c3d017a7\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_4732641cf483a6438a19c286b42\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_ratings\` ADD CONSTRAINT \`FK_1755b3b00e1d9f8cad4632324db\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`search_histories\` ADD CONSTRAINT \`FK_a154db5202c6af65df9f5db18a9\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`search_histories\` DROP FOREIGN KEY \`FK_a154db5202c6af65df9f5db18a9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_ratings\` DROP FOREIGN KEY \`FK_1755b3b00e1d9f8cad4632324db\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_4732641cf483a6438a19c286b42\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`type\` enum ('CUSTOMER', 'SERVICE_PROVIDER') NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_14d1adea0db135f924c3d017a7\` ON \`service_providers\``,
    );
    await queryRunner.query(`DROP TABLE \`service_providers\``);
    await queryRunner.query(`DROP TABLE \`search_histories\``);
    await queryRunner.query(`DROP TABLE \`product_ratings\``);
    await queryRunner.query(`DROP TABLE \`product_items\``);
    await queryRunner.query(`DROP TABLE \`product_categories\``);
    await queryRunner.query(`DROP TABLE \`products\``);
  }
}
