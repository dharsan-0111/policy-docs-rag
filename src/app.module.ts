import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DocumentsModule } from './documents/documents.module.js';
import { DocumentsController } from './documents/documents.controller.js';
import { DocumentsService } from './documents/documents.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './documents/entities/document.entity.js';
import { UserModule } from './user/user.module.js';
import { AuthenticationModule } from './authentication/authentication.module.js';
import { JwtModule } from '@nestjs/jwt';
import { IngestionModule } from './ingestion/ingestion.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchModule } from './search/search.module.js';
import { LlmModule } from './llm/llm.module.js';

@Module({
  imports: [
    DocumentsModule,
    TypeOrmModule.forFeature([Document]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [Document],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h'
        }
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthenticationModule,
    IngestionModule,
    SearchModule,
    LlmModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
