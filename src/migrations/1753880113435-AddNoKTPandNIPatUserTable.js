module.exports = class AddNoKTPandNIPatUserTable1753880113435 {
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "no_ktp" VARCHAR(20)`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "nip" VARCHAR(20)`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "no_ktp"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nip"`);
  }
};
