import { User } from '../users/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum';

export class SeedUserAdmin20240226878347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(User, {
      username: 'admin',
      password: await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        Number(process.env.BCRYPT_SALT),
      ),
      role: Role.Superuser,
      adminUuid: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await queryRunner.commitTransaction().then(async () => {
      await queryRunner.startTransaction().then(async () => {
        const admin = await queryRunner.manager.findOne(User, {
          where: {
            username: 'admin',
          },
        });

        await queryRunner.query(
          `UPDATE "users" SET admin_uuid = '${admin.uuid}' WHERE username = 'admin'`,
        );
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { username: 'admin' });
  }
}
