import { NestFactory } from '@nestjs/core';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';
import { AppModule } from './app.module';

async function bootstrap() {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule);

  const host = '0.0.0.0';
  const port = process.env.PORT || 3000;

  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
