import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1680147249172 implements MigrationInterface {
  name = 'alterTable1680147249172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_options\` DROP FOREIGN KEY \`FK_d20c89f8c43fbcb3f6cffa8a96e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_options_categories\` DROP FOREIGN KEY \`FK_1edcc5625e1314b5d8b6eba51cb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_options\` ADD CONSTRAINT \`FK_d20c89f8c43fbcb3f6cffa8a96e\` FOREIGN KEY (\`productOptionCategoryId\`) REFERENCES \`product_options_categories\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_options_categories\` ADD CONSTRAINT \`FK_1edcc5625e1314b5d8b6eba51cb\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_options_categories\` DROP FOREIGN KEY \`FK_1edcc5625e1314b5d8b6eba51cb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_options\` DROP FOREIGN KEY \`FK_d20c89f8c43fbcb3f6cffa8a96e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_options_categories\` ADD CONSTRAINT \`FK_1edcc5625e1314b5d8b6eba51cb\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_options\` ADD CONSTRAINT \`FK_d20c89f8c43fbcb3f6cffa8a96e\` FOREIGN KEY (\`productOptionCategoryId\`) REFERENCES \`product_options_categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }
}
