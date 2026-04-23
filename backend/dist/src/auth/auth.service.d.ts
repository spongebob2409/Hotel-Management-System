import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
    }>;
    getMe(userId: string): Promise<any>;
    private signToken;
    private sanitize;
}
