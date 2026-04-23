"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BillingService = class BillingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(status) {
        return this.prisma.invoice.findMany({
            where: status ? { status: status } : undefined,
            include: {
                booking: {
                    include: {
                        guest: { include: { user: true } },
                        room: { include: { category: true } },
                        extras: true,
                        parkingSessions: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                booking: {
                    include: {
                        guest: { include: { user: true } },
                        room: { include: { category: true } },
                        extras: true,
                        parkingSessions: true,
                    },
                },
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice;
    }
    markPaid(id, paymentMethod) {
        return this.prisma.invoice.update({
            where: { id },
            data: {
                status: 'PAID',
                paidAt: new Date(),
                paymentMethod: paymentMethod ?? 'cash',
            },
        });
    }
    async getSummary() {
        const invoices = await this.prisma.invoice.findMany();
        const paid = invoices.filter((i) => i.status === 'PAID');
        const unpaid = invoices.filter((i) => i.status !== 'PAID');
        return {
            totalRevenue: paid.reduce((s, i) => s + i.total, 0),
            totalPending: unpaid.reduce((s, i) => s + i.total, 0),
            totalParking: invoices.reduce((s, i) => s + i.parkingCharge, 0),
            paidCount: paid.length,
            unpaidCount: unpaid.length,
            totalInvoices: invoices.length,
        };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map