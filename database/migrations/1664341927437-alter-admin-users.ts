import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterAdminUsers1664341927437 implements MigrationInterface {
  name = 'alterAdminUsers1664341927437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`isActive\` tinyint(1) NULL DEFAULT '1'`,
    );
    await queryRunner.query(`ALTER TABLE \`admins\` ADD \`name\` varchar(200) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`isActive\``);
    await queryRunner.query(`ALTER TABLE \`admins\` DROP COLUMN \`name\``);
  }
}
