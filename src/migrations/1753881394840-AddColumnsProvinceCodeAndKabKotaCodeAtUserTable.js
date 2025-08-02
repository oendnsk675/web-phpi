module.exports = class AddColumnsProvinceCodeAndKabKotaCodeAtUserTable1753881394840 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "province_code" VARCHAR`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "kabkota_code" VARCHAR`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kabkota_code"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "province_code"`);
  }
};
