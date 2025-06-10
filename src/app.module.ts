import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { CompensationModule } from './compensation/compensation.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TripsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProjectsModule,
    CompensationModule,
    UsersModule,
    MongooseModule.forRootAsync({
      // using factory so that the .env file would be read before attempting the connection (had problems with env var being 'undefined')
      useFactory: () => ({
        uri: process.env.MONGO_DB_URI,
        dbName: process.env.MONGO_DB_NAME,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
