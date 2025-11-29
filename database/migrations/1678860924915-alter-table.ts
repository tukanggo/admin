import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1678860924915 implements MigrationInterface {
  name = 'alterTable1678860924915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer_points\` CHANGE \`point\` \`point\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` CHANGE \`point\` \`point\` int UNSIGNED NULL`,
    );
  }
}
