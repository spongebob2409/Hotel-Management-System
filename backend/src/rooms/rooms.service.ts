import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  findAll(status?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.room.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: status ? { status: status as any } : undefined,
      include: { category: true },
      orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
    });
  }

  findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.room.findUnique({
      where: { id },
      include: {
        category: true,
        bookings: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.room.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: { status: status as any },
    });
  }

  async seedRooms() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const existing = await this.prisma.room.count();
    if (existing > 0) return { message: 'Rooms already seeded' };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const standard = await this.prisma.roomCategory.create({
      data: { name: 'Standard', basePrice: 5100, maxOccupancy: 2 },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const deluxe = await this.prisma.roomCategory.create({
      data: { name: 'Deluxe', basePrice: 6200, maxOccupancy: 3 },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const suite = await this.prisma.roomCategory.create({
      data: { name: 'Suite', basePrice: 15500, maxOccupancy: 4 },
    });

    const rooms = [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '101', floor: 1, categoryId: standard.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '102', floor: 1, categoryId: standard.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '103', floor: 1, categoryId: standard.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '104', floor: 1, categoryId: standard.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '105', floor: 1, categoryId: deluxe.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '106', floor: 1, categoryId: deluxe.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '201', floor: 2, categoryId: deluxe.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '202', floor: 2, categoryId: deluxe.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '203', floor: 2, categoryId: deluxe.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '204', floor: 2, categoryId: deluxe.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '205', floor: 2, categoryId: standard.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '301', floor: 3, categoryId: suite.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '302', floor: 3, categoryId: suite.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '310', floor: 3, categoryId: deluxe.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '312', floor: 3, categoryId: suite.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '401', floor: 4, categoryId: suite.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '402', floor: 4, categoryId: suite.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '403', floor: 4, categoryId: suite.id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      { roomNumber: '418', floor: 4, categoryId: suite.id },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.room.createMany({ data: rooms });
    return { message: `${rooms.length} rooms seeded successfully` };
  }
}
