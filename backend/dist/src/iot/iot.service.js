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
exports.IoTService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IoTService = class IoTService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getEvents(limit = 50) {
        return this.prisma.ioTEvent.findMany({
            take: limit,
            include: { sensor: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    getSensors() {
        return this.prisma.sensor.findMany({
            include: { room: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    async handleEvent(payload) {
        let sensor = await this.prisma.sensor.findUnique({
            where: { sensorRef: payload.sensorRef },
        });
        if (!sensor) {
            sensor = await this.prisma.sensor.create({
                data: {
                    sensorRef: payload.sensorRef,
                    type: payload.eventType.includes('garage')
                        ? 'GARAGE'
                        : payload.eventType.includes('motion')
                            ? 'MOTION'
                            : 'DOOR',
                    location: payload.data?.location ?? payload.sensorRef,
                },
            });
        }
        await this.prisma.sensor.update({
            where: { id: sensor.id },
            data: { lastPing: new Date() },
        });
        const event = await this.prisma.ioTEvent.create({
            data: {
                sensorId: sensor.id,
                eventType: payload.eventType,
                payload: payload.data ?? {},
            },
            include: { sensor: true },
        });
        if (payload.eventType === 'garage_entry' && payload.data?.bookingId) {
            await this.prisma.parkingSession.create({
                data: {
                    bookingId: payload.data.bookingId,
                    vehicleNumber: payload.data.vehicleNumber ?? 'UNKNOWN',
                    bay: payload.data.bay ?? 'A',
                    entryTime: new Date(),
                },
            });
        }
        if (payload.eventType === 'garage_exit' && payload.data?.sessionId) {
            const session = await this.prisma.parkingSession.findUnique({
                where: { id: payload.data.sessionId },
            });
            if (session) {
                const exit = new Date();
                const durationMinutes = Math.ceil((exit.getTime() - session.entryTime.getTime()) / 60000);
                const charge = Math.ceil(durationMinutes / 60) * 200;
                await this.prisma.parkingSession.update({
                    where: { id: session.id },
                    data: {
                        exitTime: exit,
                        durationMinutes,
                        charge,
                        addedToInvoice: true,
                    },
                });
                await this.prisma.invoice.updateMany({
                    where: { bookingId: session.bookingId },
                    data: { parkingCharge: { increment: charge } },
                });
            }
        }
        return event;
    }
    resolveEvent(id) {
        return this.prisma.ioTEvent.update({
            where: { id },
            data: { resolved: true },
        });
    }
    getParkingSessions() {
        return this.prisma.parkingSession.findMany({
            include: { booking: { include: { guest: { include: { user: true } } } } },
            orderBy: { entryTime: 'desc' },
        });
    }
    async seedSensors() {
        const existing = await this.prisma.sensor.count();
        if (existing > 0)
            return { message: 'Sensors already seeded' };
        await this.prisma.sensor.createMany({
            data: [
                { sensorRef: 'DOOR-204', type: 'DOOR', location: 'Room 204' },
                { sensorRef: 'DOOR-312', type: 'DOOR', location: 'Room 312' },
                { sensorRef: 'DOOR-108', type: 'DOOR', location: 'Room 108' },
                { sensorRef: 'DOOR-401', type: 'DOOR', location: 'Room 401' },
                { sensorRef: 'GAR-ENTRY', type: 'GARAGE', location: 'Garage Entry' },
                { sensorRef: 'GAR-EXIT', type: 'GARAGE', location: 'Garage Exit' },
                { sensorRef: 'MOT-F3', type: 'MOTION', location: 'Floor 3 Hallway' },
                { sensorRef: 'MOT-LOB', type: 'MOTION', location: 'Lobby' },
            ],
        });
        return { message: '8 sensors seeded' };
    }
};
exports.IoTService = IoTService;
exports.IoTService = IoTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IoTService);
//# sourceMappingURL=iot.service.js.map