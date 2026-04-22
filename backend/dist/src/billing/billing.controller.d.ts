import { BillingService } from './billing.service';
export declare class BillingController {
    private billingService;
    constructor(billingService: BillingService);
    findAll(status?: string): any;
    getSummary(): Promise<{
        totalRevenue: any;
        totalPending: any;
        totalParking: any;
        paidCount: any;
        unpaidCount: any;
        totalInvoices: any;
    }>;
    findOne(id: string): Promise<any>;
    markPaid(id: string, paymentMethod?: string): any;
}
