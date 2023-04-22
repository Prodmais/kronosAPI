import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

import { MailModule } from './mail/mail.module';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { SprintModule } from './sprint/sprint.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ProjectModule,
    MailModule,
    BoardModule,
    TaskModule,
    SprintModule,
  ],
  providers: [],
})
export class AppModule {}
