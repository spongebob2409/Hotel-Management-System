import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { join } from 'node:path';

// Resolve the generated client from the backend root so the compiled app can load it too.
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const { PrismaClient } = require(join(process.cwd(), 'generated/prisma'));

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const prismaClient = new PrismaClient();

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private client = prismaClient;

  get user() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.user;
  }
  get guest() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.guest;
  }
  get room() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.room;
  }
  get roomCategory() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.roomCategory;
  }
  get booking() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.booking;
  }
  get bookingExtra() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.bookingExtra;
  }
  get invoice() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.invoice;
  }
  get parkingSession() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.parkingSession;
  }
  get sensor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.sensor;
  }
  get ioTEvent() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.ioTEvent;
  }
  get staff() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.staff;
  }
  get housekeepingTask() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.housekeepingTask;
  }
  get maintenanceRequest() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.maintenanceRequest;
  }
  get notification() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.client.notification;
  }

  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.client.$connect();
  }

  async onModuleDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.client.$disconnect();
  }
}
