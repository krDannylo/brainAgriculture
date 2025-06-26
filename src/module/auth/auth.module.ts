import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

//Módulo Global - Pode ser usado na aplicação inteira ( não preciso importar em outros módulos para usar como é comumente feito) tendo apenas que importar ele no APP Module
@Global()
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  providers: [{
    provide: HashingServiceProtocol, //Provedor
    useClass: BcryptService //Use Class é a classe usada pelo provedor
  }, AuthService],
  exports: [
    HashingServiceProtocol, //Por isso na hora de export eu mantenho apenas o provider
    JwtModule,
    ConfigModule
  ],
  controllers: [AuthController]
})
export class AuthModule { }
