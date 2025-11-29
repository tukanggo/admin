import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUserTable1663904796037 implements MigrationInterface {
  name = 'alterUserTable1663904796037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`resetPasswordToken\` varchar(10) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`resetPasswordToken\``);
  }
}
