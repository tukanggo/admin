import { MigrationInterface, QueryRunner } from "typeorm";

export class updateServiceProviderCustomerTable1665025645564 implements MigrationInterface {
    name = 'updateServiceProviderCustomerTable1665025645564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`banners\` ADD \`title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`banners\` ADD \`content\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`fcmToken\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD \`fcmToken\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP COLUMN \`fcmToken\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`fcmToken\``);
        await queryRunner.query(`ALTER TABLE \`banners\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`banners\` DROP COLUMN \`title\``);
    }

}
