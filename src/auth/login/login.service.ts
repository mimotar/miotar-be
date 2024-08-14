import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createLoginDto: CreateLoginDto) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: createLoginDto.email,
        },
        include: {
          profile: {
            include: {},
          },
        },
      });

      const comparePassword = bcrypt.compareSync(
        createLoginDto.password,
        user.password,
      );

      if (!comparePassword) {
        throw new Error();
      }
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
      return { user, access_token };
    } catch (error) {
      throw new BadRequestException({
        message: 'Email or password is incorrect',
      });
    }
  }
}
