import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1679991454649 implements MigrationInterface {
  name = 'alterTable1679991454649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`admins\` ADD \`isActive\` tinyint(1) NULL DEFAULT '1'`);
    await queryRunner.query(`ALTER TABLE \`customers\` ADD \`memberId\` varchar(20) NULL`);
    await queryRunner.query(`ALTER TABLE \`product_categories\` ADD \`description\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` ADD \`personalIC\` varchar(20) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`officeNo\` varchar(20) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` ADD \`employeeNo\` varchar(20) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` ADD \`providerType\` enum ('FREELANCE', 'COMPANY') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`providerType\``);
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`employeeNo\``);
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`officeNo\``);
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`personalIC\``);
    await queryRunner.query(`ALTER TABLE \`product_categories\` DROP COLUMN \`description\``);
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`memberId\``);
    await queryRunner.query(`ALTER TABLE \`admins\` DROP COLUMN \`isActive\``);
  }
}
