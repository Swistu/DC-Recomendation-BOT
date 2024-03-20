import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";

import {PostgreSqlContainer, StartedPostgreSqlContainer,} from "@testcontainers/postgresql";
import {Client} from "pg";

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let container: StartedPostgreSqlContainer;
    // let client: Client;

    beforeAll(async () => {
      container = await new PostgreSqlContainer("postgres")
          // .withExposedPorts(5432)
          // .withDatabase('nest')
          // .withUsername('root')
          // .withPassword('secret')
          .start();

      // client = new Client({
      //       host: container.getHost(),
      //       port: container.getPort(),
      //       database: container.getDatabase(),
      //       user: container.getUsername(),
      //       password: container.getPassword(),
      //   });
      //   await client.connect();
      //
      //   const result = await client.query("SELECT 1");
      //   expect(result.rows[0]).toEqual({"?column?": 1});


        process.env.POSTGRES_HOST = container.getHost();
        process.env.POSTGRES_PORT = container.getMappedPort(5432).toString();
        process.env.POSTGRES_USER = container.getUsername();
        process.env.POSTGRES_PASSWORD = container.getPassword();
        process.env.POSTGRES_DATABASE = container.getDatabase();

        console.log("res:" + JSON.stringify(process.env.POSTGRES_PASSWORD));
        console.log("res2:" + JSON.stringify(container.getPassword()));
        console.log("res3:" + JSON.stringify(process.env.POSTGRES_PORT));
        console.log("res4:" + JSON.stringify(process.env));
        console.log("res5:" + JSON.stringify(container));
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    }, 50000);

    afterAll(async () => {
        await app.close();
        // await client.end();
        await container.stop();
    });
    //
    // it('/ (GET)', () => {
    //   return request(app.getHttpServer())
    //     .get('/')
    //     .expect(200)
    //     .expect('Hello World!');
    // });

    it("should connect and return a query result", async () => {

      console.log("tutej");
      request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    }, 13000);

});
