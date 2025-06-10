// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';

// const server = express();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
//   app.setGlobalPrefix('api');
//   app.enableCors();
//   await app.init();
// }

// bootstrap();

// export default server; // required by Vercel

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 8080);
}
void bootstrap();
