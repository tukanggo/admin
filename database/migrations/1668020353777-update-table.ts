import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTable1668020353777 implements MigrationInterface {
    name = 'updateTable1668020353777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`latitude\` \`latitude\` decimal(10,7) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`longitude\` \`longitude\` decimal(10,7) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` CHANGE \`latitude\` \`latitude\` decimal(10,7) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` CHANGE \`longitude\` \`longitude\` decimal(10,7) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` CHANGE \`longitude\` \`longitude\` decimal(8,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` CHANGE \`latitude\` \`latitude\` decimal(8,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`longitude\` \`longitude\` decimal(8,3) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`latitude\` \`latitude\` decimal(8,3) NULL`);
    }

}
