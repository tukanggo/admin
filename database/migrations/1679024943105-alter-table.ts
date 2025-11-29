import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTable1679024943105 implements MigrationInterface {
  name = 'alterTable1679024943105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` DROP FOREIGN KEY \`FK_565f577093760c6c7ce8de9d137\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` DROP FOREIGN KEY \`FK_910cebcb5d32747cf51375efae0\``,
    );
    await queryRunner.query(`ALTER TABLE \`customer_products\` DROP COLUMN \`categoryId\``);
    await queryRunner.query(`ALTER TABLE \`customer_products\` DROP COLUMN \`serviceProviderId\``);
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD CONSTRAINT \`FK_464c5f277754f17e8133b6b4f9a\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD CONSTRAINT \`FK_9045c2e83a54084cdc42d5e319b\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` DROP FOREIGN KEY \`FK_9045c2e83a54084cdc42d5e319b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` DROP FOREIGN KEY \`FK_464c5f277754f17e8133b6b4f9a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD \`serviceProviderId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD \`categoryId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD CONSTRAINT \`FK_910cebcb5d32747cf51375efae0\` FOREIGN KEY (\`categoryId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_products\` ADD CONSTRAINT \`FK_565f577093760c6c7ce8de9d137\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`customers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }
}
