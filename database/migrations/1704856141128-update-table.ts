import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1704856141128 implements MigrationInterface {
  name = 'updateTable1704856141128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` ADD \`referredUserId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` ADD CONSTRAINT \`FK_c1715989cac61fcf2f7f1ccb852\` FOREIGN KEY (\`referredUserId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` DROP FOREIGN KEY \`FK_c1715989cac61fcf2f7f1ccb852\``,
    );
    await queryRunner.query(`ALTER TABLE \`customer_points\` DROP COLUMN \`referredUserId\``);
  }
}
