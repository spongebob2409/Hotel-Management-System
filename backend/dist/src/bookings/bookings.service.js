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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(status) {
        return this.prisma.booking.findMany({
            where: status ? { status: status } : undefined,
            include: {
                guest: { include: { user: true } },
                room: { include: { category: true } },
                invoice: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
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
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async create(dto) {
        const room = await this.prisma.room.findUnique({
            where: { id: dto.roomId },
        });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        if (room.status !== 'AVAILABLE')
            throw new common_1.BadRequestException('Room is not available');
        if (!dto.checkIn || !dto.checkOut) {
            throw new common_1.BadRequestException('Check-in and check-out are required');
        }
        const checkIn = new Date(dto.checkIn);
        const checkOut = new Date(dto.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000);
        if (nights <= 0)
            throw new common_1.BadRequestException('Check-out must be after check-in');
        const category = await this.prisma.roomCategory.findUnique({
            where: { id: room.categoryId },
        });
        const roomCharge = (category?.basePrice ?? 0) * nights;
        const tax = roomCharge * 0.1;
        const total = roomCharge + tax;
        const booking = await this.prisma.booking.create({
            data: {
                guestId: dto.guestId,
                roomId: dto.roomId,
                checkIn,
                checkOut,
                adults: dto.adults ?? 1,
                children: dto.children ?? 0,
                parkingEnabled: dto.parkingEnabled ?? false,
                notes: dto.notes,
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
        await this.prisma.room.update({
            where: { id: dto.roomId },
            data: { status: 'OCCUPIED' },
        });
        return booking;
    }
    async checkIn(id) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return this.prisma.booking.update({
            where: { id },
            data: { status: 'CHECKED_IN' },
        });
    }
    async checkOut(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { parkingSessions: true, extras: true, invoice: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const parkingCharge = booking.parkingSessions.reduce((s, p) => s + (p.charge ?? 0), 0);
        const extrasCharge = booking.extras.reduce((s, e) => s + e.amount, 0);
        const roomCharge = booking.invoice?.roomCharge ?? 0;
        const tax = (roomCharge + parkingCharge + extrasCharge) * 0.1;
        const total = roomCharge + parkingCharge + extrasCharge + tax;
        await this.prisma.invoice.update({
            where: { bookingId: id },
            data: { parkingCharge, extrasCharge, tax, total },
        });
        await this.prisma.room.update({
            where: { id: booking.roomId },
            data: { status: 'CLEANING' },
        });
        return this.prisma.booking.update({
            where: { id },
            data: { status: 'CHECKED_OUT' },
            include: { invoice: true },
        });
    }
    async cancel(id) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        await this.prisma.room.update({
            where: { id: booking.roomId },
            data: { status: 'AVAILABLE' },
        });
        return this.prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map