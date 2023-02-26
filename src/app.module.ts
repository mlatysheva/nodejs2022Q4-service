import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeOrmConfig';
import { LogsMiddleware } from './modules/logger/logs.middleware';
import { LoggerModule } from './modules/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/guard/jwt.guard';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
