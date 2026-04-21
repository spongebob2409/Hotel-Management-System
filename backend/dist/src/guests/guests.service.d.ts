import { PrismaService } from '../prisma/prisma.service';
export declare class GuestsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string): any;
    findOne(id: string): Promise<any>;
    updateVip(id: string, vipStatus: boolean): any;
}
