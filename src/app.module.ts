import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { SprintModule } from './sprint/sprint.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ProjectModule,
    BoardModule,
    TaskModule,
    SprintModule,
  ],
})
export class AppModule {}
