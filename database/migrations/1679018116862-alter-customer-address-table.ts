import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterCustomerAddressTable1679018116862 implements MigrationInterface {
  name = 'alterCustomerAddressTable1679018116862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_addresses\` ADD \`setDefault\` tinyint(1) NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer_addresses\` DROP COLUMN \`setDefault\``);
  }
}
