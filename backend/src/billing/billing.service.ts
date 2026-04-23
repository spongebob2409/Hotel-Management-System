import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  findAll(status?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.invoice.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: status ? { status: status as any } : undefined,
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

  async findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
    if (!invoice) throw new NotFoundException('Invoice not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return invoice;
  }

  markPaid(id: string, paymentMethod?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const invoices = await this.prisma.invoice.findMany();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const paid = invoices.filter((i) => i.status === 'PAID');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const unpaid = invoices.filter((i) => i.status !== 'PAID');

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      totalRevenue: paid.reduce((s, i) => s + i.total, 0),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      totalPending: unpaid.reduce((s, i) => s + i.total, 0),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      totalParking: invoices.reduce((s, i) => s + i.parkingCharge, 0),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      paidCount: paid.length,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      unpaidCount: unpaid.length,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      totalInvoices: invoices.length,
    };
  }
}
