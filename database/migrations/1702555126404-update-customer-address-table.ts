import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCustomerAddressTable1702555126404 implements MigrationInterface {
  name = 'updateCustomerAddressTable1702555126404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer_addresses\` ADD \`city\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer_addresses\` DROP COLUMN \`city\``);
  }
}
