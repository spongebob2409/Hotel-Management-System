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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RoomsService = class RoomsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(status) {
        return this.prisma.room.findMany({
            where: status ? { status: status } : undefined,
            include: { category: true },
            orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
        });
    }
    findOne(id) {
        return this.prisma.room.findUnique({
            where: { id },
            include: {
                category: true,
                bookings: { take: 5, orderBy: { createdAt: 'desc' } },
            },
        });
    }
    async updateStatus(id, status) {
        const room = await this.prisma.room.findUnique({ where: { id } });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return this.prisma.room.update({
            where: { id },
            data: { status: status },
        });
    }
    async seedRooms() {
        const existing = await this.prisma.room.count();
        if (existing > 0)
            return { message: 'Rooms already seeded' };
        const standard = await this.prisma.roomCategory.create({
            data: { name: 'Standard', basePrice: 5100, maxOccupancy: 2 },
        });
        const deluxe = await this.prisma.roomCategory.create({
            data: { name: 'Deluxe', basePrice: 6200, maxOccupancy: 3 },
        });
        const suite = await this.prisma.roomCategory.create({
            data: { name: 'Suite', basePrice: 15500, maxOccupancy: 4 },
        });
        const rooms = [
            { roomNumber: '101', floor: 1, categoryId: standard.id },
            { roomNumber: '102', floor: 1, categoryId: standard.id },
            { roomNumber: '103', floor: 1, categoryId: standard.id },
            { roomNumber: '104', floor: 1, categoryId: standard.id },
            { roomNumber: '105', floor: 1, categoryId: deluxe.id },
            { roomNumber: '106', floor: 1, categoryId: deluxe.id },
            { roomNumber: '201', floor: 2, categoryId: deluxe.id },
            { roomNumber: '202', floor: 2, categoryId: deluxe.id },
            { roomNumber: '203', floor: 2, categoryId: deluxe.id },
            { roomNumber: '204', floor: 2, categoryId: deluxe.id },
            { roomNumber: '205', floor: 2, categoryId: standard.id },
            { roomNumber: '301', floor: 3, categoryId: suite.id },
            { roomNumber: '302', floor: 3, categoryId: suite.id },
            { roomNumber: '310', floor: 3, categoryId: deluxe.id },
            { roomNumber: '312', floor: 3, categoryId: suite.id },
            { roomNumber: '401', floor: 4, categoryId: suite.id },
            { roomNumber: '402', floor: 4, categoryId: suite.id },
            { roomNumber: '403', floor: 4, categoryId: suite.id },
            { roomNumber: '418', floor: 4, categoryId: suite.id },
        ];
        await this.prisma.room.createMany({ data: rooms });
        return { message: `${rooms.length} rooms seeded successfully` };
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map