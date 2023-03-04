import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { SignupDto } from 'src/auth/dto';

describe('Auth Controller e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const authDto: SignupDto = {
      name: 'Test',
      lastName: 'test',
      phone: '99912341234',
      email: 'testjest@gamil.com',
      password: '@Ab123',
    };

    describe('Signup', () => {
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });

      it('should throw if both empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should throw if password don`t have any letters in Upper Case', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...authDto,
            password: '@ab123',
          })
          .expectStatus(400);
      });

      it('should throw if password don`t have any letters in Lower Case', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...authDto,
            password: '@AB123',
          })
          .expectStatus(400);
      });

      it('should throw if password don`t have any numerals', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...authDto,
            password: '@ABabc',
          })
          .expectStatus(400);
      });

      it('should throw if password don`t have any Special Character', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...authDto,
            password: '1ABabc',
          })
          .expectStatus(400);
      });

      it('should throw if password don`t have spaces', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...authDto,
            password: ' ',
          })
          .expectStatus(400);
      });

      it('should throw if password don`t have 6 characters length', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            ...authDto,
            password: '123',
          })
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(authDto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });

      it('should throw if both empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: authDto.email,
            password: authDto.password,
          })
          .expectStatus(200)
          .stores('userAt', 'token');
      });
    });
  });
});
