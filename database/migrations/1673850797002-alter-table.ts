import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1673850797002 implements MigrationInterface {
  name = 'alterTable1673850797002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` CHANGE \`type\` \`status\` enum ('PENDING', 'ACCEPT', 'REJECT') NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` CHANGE \`status\` \`type\` enum ('PENDING', 'ACCEPT', 'REJECT') NOT NULL DEFAULT 'PENDING'`,
    );
  }
}
