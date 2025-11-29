import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1705372404984 implements MigrationInterface {
  name = 'updateTable1705372404984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_areas\` CHANGE \`name\` \`area\` varchar(200) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`service_areas\` CHANGE \`area\` \`name\` varchar(200) NULL`,
    );
  }
}
