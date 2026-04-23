import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.guest.findMany({
      where: search
        ? {
            user: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
              ],
            },
          }
        : undefined,
      include: { user: true, bookings: { select: { id: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const guest = await this.prisma.guest.findUnique({
      where: { id },
      include: {
        user: true,
        bookings: {
          include: { room: { include: { category: true } }, invoice: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!guest) throw new NotFoundException('Guest not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return guest;
  }

  updateVip(id: string, vipStatus: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.guest.update({ where: { id }, data: { vipStatus } });
  }
}
