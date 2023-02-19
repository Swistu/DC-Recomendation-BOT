import { NestFactory } from '@nestjs/core';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';
import { AppModule } from './app.module';

async function bootstrap() {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
