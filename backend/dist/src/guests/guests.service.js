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
exports.GuestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GuestsService = class GuestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(search) {
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
    async findOne(id) {
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
        if (!guest)
            throw new common_1.NotFoundException('Guest not found');
        return guest;
    }
    updateVip(id, vipStatus) {
        return this.prisma.guest.update({ where: { id }, data: { vipStatus } });
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GuestsService);
//# sourceMappingURL=guests.service.js.map