import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

type BcryptLike = {
  hash(password: string, saltRounds: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
};

const bcryptTyped = bcrypt as unknown as BcryptLike;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already registered')

    const passwordHash = await bcryptTyped.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        role: (dto.role as any) ?? 'RECEPTIONIST',
      },
    })

    const token = this.signToken(user.id, user.email, user.role);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { token, user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcryptTyped.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.signToken(user.id, user.email, user.role);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { token, user: this.sanitize(user) };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.sanitize(user);
  }

  private signToken(userId: string, email: string, role: string) {
    return this.jwt.sign({ sub: userId, email, role });
  }

  private sanitize(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rest;
  }
}
