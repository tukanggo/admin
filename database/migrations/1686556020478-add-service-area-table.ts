import { MigrationInterface, QueryRunner } from 'typeorm';

export class addServiceAreaTable1686556020478 implements MigrationInterface {
  name = 'addServiceAreaTable1686556020478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`service_areas\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(200) NULL, \`serviceProviderId\` int UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_areas\` ADD CONSTRAINT \`FK_8832f64cb49f77eae19445ff6c2\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_areas\` DROP FOREIGN KEY \`FK_8832f64cb49f77eae19445ff6c2\``,
    );
    await queryRunner.query(`DROP TABLE \`service_areas\``);
  }
}
