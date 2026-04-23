import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(status?: string): any;
    findOne(id: string): Promise<any>;
    create(dto: CreateBookingDto): Promise<any>;
    checkIn(id: string): Promise<any>;
    checkOut(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
}
