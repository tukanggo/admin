import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTable1664956611814 implements MigrationInterface {
  name = 'updateTable1664956611814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`promo_codes\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`deletedBy\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NULL, \`description\` text NULL, \`code\` varchar(20) NULL, \`quantity\` int NULL, \`discountCap\` decimal(12,2) NULL, \`discountPercentage\` int(3) NULL, \`startDate\` date NULL, \`endDate\` date NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`vat\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`vatPercentage\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`vatName\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`discount\``);
    await queryRunner.query(`ALTER TABLE \`customer_addresses\` ADD \`addressDetail\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD \`serviceProviderId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD \`salesOrdersId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD \`subtotal\` decimal(12,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD \`discountTotal\` decimal(12,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD \`grandTotal\` decimal(12,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD \`salesOrderId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` ADD \`salesOrderMatchId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` ADD \`itemName\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` ADD \`unitPrice\` decimal(12,2) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` ADD \`quantity\` int(8) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` ADD \`subtotal\` decimal(12,2) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`promoCodeId\` int UNSIGNED NULL`);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`productId\` int UNSIGNED NULL`);
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`customerAddressId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`salesOrderMatchId\` int UNSIGNED NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD UNIQUE INDEX \`IDX_06446057131907564f6a41e28d\` (\`salesOrderMatchId\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`preferredDateTime\` datetime NULL`);
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`alternativeDateTime\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`salesOrderStatus\` enum ('PENDING', 'READY_TO_REDEEM', 'REDEEMED', 'PENDING_SERVICE', 'IN_PROGRESS', 'COMPLETE') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`paymentStatus\` enum ('PENDING_PAYMENT', 'PAID', 'FAIL_PAYMENT') NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`matchValidity\` datetime NULL`);
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`discountTotal\` decimal(12,2) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`paymentUrl\` text NULL`);
    await queryRunner.query(
      `ALTER TABLE \`service_providers\` ADD \`isActive\` tinyint(1) NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_06446057131907564f6a41e28d\` ON \`sales_orders\` (\`salesOrderMatchId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD CONSTRAINT \`FK_e24624ef7ce8b4357f0a156552a\` FOREIGN KEY (\`serviceProviderId\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` ADD CONSTRAINT \`FK_cf50446d5a195174215d8288858\` FOREIGN KEY (\`salesOrderId\`) REFERENCES \`sales_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` ADD CONSTRAINT \`FK_f6678fa019768a2be122f3983d1\` FOREIGN KEY (\`salesOrderMatchId\`) REFERENCES \`sales_order_matches\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_13f5acde13ce02179dbfafa3a2e\` FOREIGN KEY (\`promoCodeId\`) REFERENCES \`promo_codes\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_6833ec2b0b673a3ea98c17ce835\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_36d0d07a609dcb0a504ec579b7f\` FOREIGN KEY (\`customerAddressId\`) REFERENCES \`customer_addresses\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD CONSTRAINT \`FK_06446057131907564f6a41e28d4\` FOREIGN KEY (\`salesOrderMatchId\`) REFERENCES \`sales_order_matches\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_06446057131907564f6a41e28d4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_36d0d07a609dcb0a504ec579b7f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_6833ec2b0b673a3ea98c17ce835\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP FOREIGN KEY \`FK_13f5acde13ce02179dbfafa3a2e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` DROP FOREIGN KEY \`FK_f6678fa019768a2be122f3983d1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` DROP FOREIGN KEY \`FK_cf50446d5a195174215d8288858\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` DROP FOREIGN KEY \`FK_e24624ef7ce8b4357f0a156552a\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_06446057131907564f6a41e28d\` ON \`sales_orders\``);
    await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`isActive\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`paymentUrl\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`discountTotal\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`matchValidity\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`paymentStatus\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`salesOrderStatus\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`alternativeDateTime\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`preferredDateTime\``);
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` DROP INDEX \`IDX_06446057131907564f6a41e28d\``,
    );
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`salesOrderMatchId\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`customerAddressId\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`productId\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` DROP COLUMN \`promoCodeId\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` DROP COLUMN \`subtotal\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` DROP COLUMN \`quantity\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` DROP COLUMN \`unitPrice\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches_items\` DROP COLUMN \`itemName\``);
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches_items\` DROP COLUMN \`salesOrderMatchId\``,
    );
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`salesOrderId\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`grandTotal\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`discountTotal\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`subtotal\``);
    await queryRunner.query(`ALTER TABLE \`sales_order_matches\` DROP COLUMN \`salesOrdersId\``);
    await queryRunner.query(
      `ALTER TABLE \`sales_order_matches\` DROP COLUMN \`serviceProviderId\``,
    );
    await queryRunner.query(`ALTER TABLE \`customer_addresses\` DROP COLUMN \`addressDetail\``);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`discount\` decimal(12,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`vatName\` varchar(50) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`sales_orders\` ADD \`vatPercentage\` decimal(12,2) NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`sales_orders\` ADD \`vat\` decimal(12,2) NULL`);
    await queryRunner.query(`DROP TABLE \`promo_codes\``);
  }
}
