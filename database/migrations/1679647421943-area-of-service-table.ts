import { MigrationInterface, QueryRunner } from 'typeorm';

export class areaOfServiceTable1679647421943 implements MigrationInterface {
  name = 'areaOfServiceTable1679647421943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_area_of_services\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`productId\` int UNSIGNED NULL, \`areaOfServiceId\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`area_of_services\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(200) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_area_of_services\` ADD CONSTRAINT \`FK_d12ff75d24d4c58cf28f93ac3ab\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_area_of_services\` ADD CONSTRAINT \`FK_184e2b08f65f38a0bf9f1c667e7\` FOREIGN KEY (\`areaOfServiceId\`) REFERENCES \`area_of_services\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_area_of_services\` DROP FOREIGN KEY \`FK_184e2b08f65f38a0bf9f1c667e7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_area_of_services\` DROP FOREIGN KEY \`FK_d12ff75d24d4c58cf28f93ac3ab\``,
    );
    await queryRunner.query(`DROP TABLE \`area_of_services\``);
    await queryRunner.query(`DROP TABLE \`product_area_of_services\``);
  }
}
