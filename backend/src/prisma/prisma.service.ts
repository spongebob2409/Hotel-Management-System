import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client = prismaClient;

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
}
