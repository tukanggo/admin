import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1680599155489 implements MigrationInterface {
  name = 'alterTable1680599155489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_categories\` ADD \`isPopular\` tinyint(1) NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_categories\` DROP COLUMN \`isPopular\``);
  }
}
