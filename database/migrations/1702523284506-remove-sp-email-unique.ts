import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeSpEmailUnique1702523284506 implements MigrationInterface {
  name = 'removeSpEmailUnique1702523284506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_14d1adea0db135f924c3d017a7\` ON \`service_providers\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_14d1adea0db135f924c3d017a7\` ON \`service_providers\` (\`email\`)`,
    );
  }
}
