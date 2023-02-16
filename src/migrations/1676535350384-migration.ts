import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1676535350384 implements MigrationInterface {
  name = 'migration1676535350384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "duration" integer NOT NULL, "artistId" uuid, "albumId" uuid, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_e42953e6be13870839a04a3fa88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites_entity_artists_artist" ("favoritesEntityId" uuid NOT NULL, "artistId" uuid NOT NULL, CONSTRAINT "PK_760480c098db73010ea9a572fec" PRIMARY KEY ("favoritesEntityId", "artistId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d2ac54b1732036ccb6a09432b" ON "favorites_entity_artists_artist" ("favoritesEntityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45422be11e6f79a104a008c3ee" ON "favorites_entity_artists_artist" ("artistId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites_entity_albums_album" ("favoritesEntityId" uuid NOT NULL, "albumId" uuid NOT NULL, CONSTRAINT "PK_7e510103cacad66dedd6e167ede" PRIMARY KEY ("favoritesEntityId", "albumId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7509e9d99cfef25d6cc7db194c" ON "favorites_entity_albums_album" ("favoritesEntityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_22de08a9bad9361e4aa584ab0f" ON "favorites_entity_albums_album" ("albumId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "favorites_entity_tracks_track" ("favoritesEntityId" uuid NOT NULL, "trackId" uuid NOT NULL, CONSTRAINT "PK_6c8cf88615b36ad9c272bc7ac26" PRIMARY KEY ("favoritesEntityId", "trackId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fefad63de26e64548c05f70c29" ON "favorites_entity_tracks_track" ("favoritesEntityId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d78dfadc63fbbc8105abf7eb5" ON "favorites_entity_tracks_track" ("trackId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_artists_artist" ADD CONSTRAINT "FK_5d2ac54b1732036ccb6a09432b5" FOREIGN KEY ("favoritesEntityId") REFERENCES "favorites_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_artists_artist" ADD CONSTRAINT "FK_45422be11e6f79a104a008c3ee2" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_albums_album" ADD CONSTRAINT "FK_7509e9d99cfef25d6cc7db194c6" FOREIGN KEY ("favoritesEntityId") REFERENCES "favorites_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_albums_album" ADD CONSTRAINT "FK_22de08a9bad9361e4aa584ab0f8" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_tracks_track" ADD CONSTRAINT "FK_fefad63de26e64548c05f70c291" FOREIGN KEY ("favoritesEntityId") REFERENCES "favorites_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_tracks_track" ADD CONSTRAINT "FK_2d78dfadc63fbbc8105abf7eb52" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_tracks_track" DROP CONSTRAINT "FK_2d78dfadc63fbbc8105abf7eb52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_tracks_track" DROP CONSTRAINT "FK_fefad63de26e64548c05f70c291"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_albums_album" DROP CONSTRAINT "FK_22de08a9bad9361e4aa584ab0f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_albums_album" DROP CONSTRAINT "FK_7509e9d99cfef25d6cc7db194c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_artists_artist" DROP CONSTRAINT "FK_45422be11e6f79a104a008c3ee2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_entity_artists_artist" DROP CONSTRAINT "FK_5d2ac54b1732036ccb6a09432b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d78dfadc63fbbc8105abf7eb5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fefad63de26e64548c05f70c29"`,
    );
    await queryRunner.query(`DROP TABLE "favorites_entity_tracks_track"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_22de08a9bad9361e4aa584ab0f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7509e9d99cfef25d6cc7db194c"`,
    );
    await queryRunner.query(`DROP TABLE "favorites_entity_albums_album"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_45422be11e6f79a104a008c3ee"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d2ac54b1732036ccb6a09432b"`,
    );
    await queryRunner.query(`DROP TABLE "favorites_entity_artists_artist"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "favorites_entity"`);
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "artist"`);
  }
}
