import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1664470155080 implements MigrationInterface {
  name = 'alterTable1664470155080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`customer_addresses\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`customerId\` int UNSIGNED NULL, \`name\` varchar(255) NULL, \`address\` text NULL, \`remarks\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customer_points\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`customerId\` int UNSIGNED NULL, \`point\` int UNSIGNED NULL, \`remarks\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`customers\` ADD \`referralId\` int UNSIGNED NULL`);
    await queryRunner.query(`ALTER TABLE \`customers\` ADD \`referralCode\` varchar(30) NULL`);
    await queryRunner.query(`ALTER TABLE \`customers\` ADD \`dob\` date NULL`);
    await queryRunner.query(
      `ALTER TABLE \`customer_addresses\` ADD CONSTRAINT \`FK_7bd088b1c8d3506953240ebf030\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_288a740a8755e64f0e8026369cb\` FOREIGN KEY (\`referralId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` ADD CONSTRAINT \`FK_4b78047e7cf0d649689501878c2\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` DROP FOREIGN KEY \`FK_4b78047e7cf0d649689501878c2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_288a740a8755e64f0e8026369cb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_addresses\` DROP FOREIGN KEY \`FK_7bd088b1c8d3506953240ebf030\``,
    );
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`dob\``);
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`referralCode\``);
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`referralId\``);
    await queryRunner.query(`DROP TABLE \`customer_points\``);
    await queryRunner.query(`DROP TABLE \`customer_addresses\``);
  }
}
