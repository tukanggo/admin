import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCustomerPointTable1686631777956 implements MigrationInterface {
  name = 'updateCustomerPointTable1686631777956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` ADD \`salesOrderId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` ADD CONSTRAINT \`FK_76338f42eb163e1572d058bb215\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_points\` DROP FOREIGN KEY \`FK_76338f42eb163e1572d058bb215\``,
    );
    await queryRunner.query(`ALTER TABLE \`customer_points\` DROP COLUMN \`salesOrderId\``);
  }
}
