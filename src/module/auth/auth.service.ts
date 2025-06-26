import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateFarmerDto } from '../farmer/dto/create-farmer.dto';
import { MESSAGES } from 'src/common/constants/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService

  ) { }

  async authenticate(signInDto: SignInDto) {
    const farmer = await this.prisma.farmer.findFirst({
      where: {
        email: signInDto.email
      }
    })

    if (!farmer) throw new HttpException("Falha ao fazer login", HttpStatus.UNAUTHORIZED)

    const passwordIsValid = await this.hashingService.compare(signInDto.password, farmer.password)

    if (!passwordIsValid) throw new HttpException("Senha/Usuário Incorretos", HttpStatus.UNAUTHORIZED)

    const token = await this.jwtService.signAsync(
      {
        sub: farmer.id,
        email: farmer.email,
        role: farmer.role
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer
      }
    )

    return {
      id: farmer.id,
      name: farmer.name,
      email: farmer.email,
      token: token
    }
  }

  async register(createFarmerDto: CreateFarmerDto) {
    //! OTIMIZAR ESSA LÓGICA
    const existingFarmer = await this.prisma.farmer.findUnique({
      where: { document: createFarmerDto.document }
    })

    if (existingFarmer) throw new HttpException(MESSAGES.FARMER.CONFLICT_DOCUMENT, HttpStatus.CONFLICT)

    const existingEmail = await this.prisma.farmer.findUnique({
      where: { email: createFarmerDto.email }
    })

    if (existingEmail) throw new HttpException(MESSAGES.FARMER.CONFLICT_EMAIL, HttpStatus.CONFLICT)
    //! OTIMIZAR ESSA LÓGICA

    const passwordHash = await this.hashingService.hash(createFarmerDto.password)

    const newFarmer = await this.prisma.farmer.create({
      data: {
        name: createFarmerDto.name,
        document: createFarmerDto.document,
        email: createFarmerDto.email,
        password: passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    return newFarmer;
  }
}
