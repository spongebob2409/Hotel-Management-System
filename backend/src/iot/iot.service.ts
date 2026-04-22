import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IoTService {
  constructor(private prisma: PrismaService) {}

  getEvents(limit = 50) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.ioTEvent.findMany({
      take: limit,
      include: { sensor: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  getSensors() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.sensor.findMany({
      include: { room: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async handleEvent(payload: {
    sensorRef: string;
    eventType: string;
    data?: any;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    let sensor = await this.prisma.sensor.findUnique({
      where: { sensorRef: payload.sensorRef },
    });

    if (!sensor) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      sensor = await this.prisma.sensor.create({
        data: {
          sensorRef: payload.sensorRef,
          type: payload.eventType.includes('garage')
            ? 'GARAGE'
            : payload.eventType.includes('motion')
              ? 'MOTION'
              : 'DOOR',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          location: payload.data?.location ?? payload.sensorRef,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.sensor.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: sensor.id },
      data: { lastPing: new Date() },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const event = await this.prisma.ioTEvent.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        sensorId: sensor.id,
        eventType: payload.eventType,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        payload: payload.data ?? {},
      },
      include: { sensor: true },
    });

    // Auto-handle garage events
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (payload.eventType === 'garage_entry' && payload.data?.bookingId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.prisma.parkingSession.create({
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          bookingId: payload.data.bookingId,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          vehicleNumber: payload.data.vehicleNumber ?? 'UNKNOWN',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          bay: payload.data.bay ?? 'A',
          entryTime: new Date(),
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (payload.eventType === 'garage_exit' && payload.data?.sessionId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const session = await this.prisma.parkingSession.findUnique({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        where: { id: payload.data.sessionId },
      });
      if (session) {
        const exit = new Date();
        const durationMinutes = Math.ceil(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          (exit.getTime() - session.entryTime.getTime()) / 60000,
        );
        const charge = Math.ceil(durationMinutes / 60) * 200;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await this.prisma.parkingSession.update({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { id: session.id },
          data: {
            exitTime: exit,
            durationMinutes,
            charge,
            addedToInvoice: true,
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await this.prisma.invoice.updateMany({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { bookingId: session.bookingId },
          data: { parkingCharge: { increment: charge } },
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return event;
  }

  resolveEvent(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.ioTEvent.update({
      where: { id },
      data: { resolved: true },
    });
  }

  getParkingSessions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.parkingSession.findMany({
      include: { booking: { include: { guest: { include: { user: true } } } } },
      orderBy: { entryTime: 'desc' },
    });
  }

  async seedSensors() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const existing = await this.prisma.sensor.count();
    if (existing > 0) return { message: 'Sensors already seeded' };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
}
