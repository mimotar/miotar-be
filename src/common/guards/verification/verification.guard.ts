import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { Request } from 'express';
import { AccountStatus } from '@prisma/client';

@Injectable()
export class VerificationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const personalAccessToken =
        await this.prisma.personalAccessToken.findFirstOrThrow({
          where: {
            userId: +payload.userId,
            token: token,
          },
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        });

      if (
        !personalAccessToken.user.profile.emailVerifyAt ||
        personalAccessToken.user.profile.status === AccountStatus.PENDING
      ) {
        throw new Error();
      }
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(
        'Account not verified. Please verify your account.',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
