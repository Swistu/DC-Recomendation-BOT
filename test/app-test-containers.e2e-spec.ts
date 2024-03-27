import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ModuleMetadata} from '@nestjs/common';
import {createModule} from './../src/app.module';
import {PostgreSqlContainer} from "@testcontainers/postgresql";
import {Client} from "pg";
import * as request from 'supertest';

describe('AppController with TestContainer (e2e)', () => {
    let app: INestApplication;
    let postgresContainer;
    let postgresClient;


    beforeAll(async () => {
        postgresContainer = await new PostgreSqlContainer().start();
        postgresClient = new Client({
            host: postgresContainer.getHost(),
            port: postgresContainer.getPort(),
            database: postgresContainer.getDatabase(),
            user: postgresContainer.getUsername(),
            password: postgresContainer.getPassword(),
        });
        await postgresClient.connect();

        let moduleMetadata: ModuleMetadata = createModule({
            type: 'postgres',
            host: postgresContainer.getHost(),
            port: postgresContainer.getPort(),
            username: postgresContainer.getUsername(),
            password: postgresContainer.getPassword(),
            database: postgresContainer.getDatabase(),
            autoLoadEntities: true,
            synchronize: true,
        },
            "PROVIDE_TOKEN"
            );
        const moduleFixture: TestingModule = await Test.createTestingModule(moduleMetadata).compile();


        app = moduleFixture.createNestApplication();
        await app.init();
    }, 20000);

    afterAll(async () => {
        await postgresClient.end();
        await postgresContainer.stop();
    }, 20000);

    it('/ (GET)', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(200)
          .expect('Hello World!');
    });
});
