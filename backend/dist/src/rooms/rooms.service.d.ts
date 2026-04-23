import { PrismaService } from '../prisma/prisma.service';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(status?: string): any;
    findOne(id: string): any;
    updateStatus(id: string, status: string): Promise<any>;
    seedRooms(): Promise<{
        message: string;
    }>;
}
