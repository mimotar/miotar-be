import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailerService } from 'src/services/mailer/mailer.service';
import { CodeGeneratorService } from 'src/services/code-generator/code-generator.service';

@Injectable()
export class RegisterService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private readonly codeGeneratorService: CodeGeneratorService,
  ) {}

  async create(createRegisterDto: CreateRegisterDto): Promise<object> {
    if (
      createRegisterDto.password !== createRegisterDto.password_confirmation
    ) {
      throw new BadRequestException('Passwords do not match');
    }

    const checkUser = await this.prisma.user.findUnique({
      where: {
        email: createRegisterDto.email,
      },
    });

    if (checkUser) {
      throw new ConflictException('Email already exist');
    }

    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(
        createRegisterDto.password,
        salt,
      );
      const generatedVerificationCode =
        await this.codeGeneratorService.generateUniqueCode(6);

      const user = await this.prisma.user.create({
        data: {
          name: createRegisterDto.name,
          email: createRegisterDto.email,
          password: hashedPassword,
          profile: {
            create: {
              verificationCode: generatedVerificationCode,
            },
          },
        },
        include: {
          profile: {
            include: {},
          },
        },
      });

      const access_token = await this.jwtService.signAsync({ userId: user.id });
      // store the access token to the database
      const expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + 30);
      await this.prisma.personalAccessToken.create({
        data: {
          token: access_token,
          expireAt: expireAt,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await this.mailerService.sendVerificationMail(user.email, user);

      // remove password and verification code from the returned data
      const {
        password,
        profile: { verificationCode, ...profileData },
        ...userData
      } = user;
      return { user: { ...userData, profile: profileData }, access_token };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
