"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const node_path_1 = require("node:path");
const { PrismaClient } = require((0, node_path_1.join)(process.cwd(), 'generated/prisma'));
const prismaClient = new PrismaClient();
let PrismaService = class PrismaService {
    client = prismaClient;
    get user() {
        return this.client.user;
    }
    get guest() {
        return this.client.guest;
    }
    get room() {
        return this.client.room;
    }
    get roomCategory() {
        return this.client.roomCategory;
    }
    get booking() {
        return this.client.booking;
    }
    get bookingExtra() {
        return this.client.bookingExtra;
    }
    get invoice() {
        return this.client.invoice;
    }
    get parkingSession() {
        return this.client.parkingSession;
    }
    get sensor() {
        return this.client.sensor;
    }
    get ioTEvent() {
        return this.client.ioTEvent;
    }
    get staff() {
        return this.client.staff;
    }
    get housekeepingTask() {
        return this.client.housekeepingTask;
    }
    get maintenanceRequest() {
        return this.client.maintenanceRequest;
    }
    get notification() {
        return this.client.notification;
    }
    async onModuleInit() {
        await this.client.$connect();
    }
    async onModuleDestroy() {
        await this.client.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map