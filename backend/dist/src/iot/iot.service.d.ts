import { PrismaService } from '../prisma/prisma.service';
export declare class IoTService {
    private prisma;
    constructor(prisma: PrismaService);
    getEvents(limit?: number): any;
    getSensors(): any;
    handleEvent(payload: {
        sensorRef: string;
        eventType: string;
        data?: any;
    }): Promise<any>;
    resolveEvent(id: string): any;
    getParkingSessions(): any;
    seedSensors(): Promise<{
        message: string;
    }>;
}
