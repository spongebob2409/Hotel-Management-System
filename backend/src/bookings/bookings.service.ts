import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  findAll(status?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.booking.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: status ? { status: status as any } : undefined,
      include: {
        guest: { include: { user: true } },
        room: { include: { category: true } },
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        guest: { include: { user: true } },
        room: { include: { category: true } },
        extras: true,
        invoice: true,
        parkingSessions: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return booking;
  }

  async create(dto: CreateBookingDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const room = await this.prisma.room.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: dto.roomId },
    });
    if (!room) throw new NotFoundException('Room not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (room.status !== 'AVAILABLE')
      throw new BadRequestException('Room is not available');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!dto.checkIn || !dto.checkOut) {
      throw new BadRequestException('Check-in and check-out are required');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const checkIn = new Date(dto.checkIn);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const checkOut = new Date(dto.checkOut);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / 86400000,
    );
    if (nights <= 0)
      throw new BadRequestException('Check-out must be after check-in');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const category = await this.prisma.roomCategory.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: room.categoryId },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const roomCharge = (category?.basePrice ?? 0) * nights;
    const tax = roomCharge * 0.1;
    const total = roomCharge + tax;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const booking = await this.prisma.booking.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        guestId: dto.guestId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        roomId: dto.roomId,
        checkIn,
        checkOut,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        adults: dto.adults ?? 1,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        children: dto.children ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        parkingEnabled: dto.parkingEnabled ?? false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        notes: dto.notes,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        paymentMethod: dto.paymentMethod ?? 'cash',
        status: 'CONFIRMED',
        invoice: {
          create: { roomCharge, tax, total, status: 'UNPAID' },
        },
      },
      include: {
        invoice: true,
        room: true,
        guest: { include: { user: true } },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.room.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: dto.roomId },
      data: { status: 'OCCUPIED' },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return booking;
  }

  async checkIn(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CHECKED_IN' },
    });
  }

  async checkOut(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { parkingSessions: true, extras: true, invoice: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const parkingCharge = booking.parkingSessions.reduce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      (s, p) => s + (p.charge ?? 0),
      0,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    const extrasCharge = booking.extras.reduce((s, e) => s + e.amount, 0);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const roomCharge = booking.invoice?.roomCharge ?? 0;
    const tax = (roomCharge + parkingCharge + extrasCharge) * 0.1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const total = roomCharge + parkingCharge + extrasCharge + tax;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.invoice.update({
      where: { bookingId: id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: { parkingCharge, extrasCharge, tax, total },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.room.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: booking.roomId },
      data: { status: 'CLEANING' },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CHECKED_OUT' },
      include: { invoice: true },
    });
  }

  async cancel(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.room.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: booking.roomId },
      data: { status: 'AVAILABLE' },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
