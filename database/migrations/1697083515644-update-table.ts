import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1697083515644 implements MigrationInterface {
  name = 'updateTable1697083515644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`phoneCountryCode\` \`phoneCountryCode\` varchar(10) NULL DEFAULT '+60'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`phoneCountryCode\` \`phoneCountryCode\` varchar(10) NULL`,
    );
  }
}
