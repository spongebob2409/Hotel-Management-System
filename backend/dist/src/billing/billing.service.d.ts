import { PrismaService } from '../prisma/prisma.service';
export declare class BillingService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(status?: string): any;
    findOne(id: string): Promise<any>;
    markPaid(id: string, paymentMethod?: string): any;
    getSummary(): Promise<{
        totalRevenue: any;
        totalPending: any;
        totalParking: any;
        paidCount: any;
        unpaidCount: any;
        totalInvoices: any;
    }>;
}
