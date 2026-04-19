import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private client;
    get user(): any;
    get guest(): any;
    get room(): any;
    get roomCategory(): any;
    get booking(): any;
    get bookingExtra(): any;
    get invoice(): any;
    get parkingSession(): any;
    get sensor(): any;
    get ioTEvent(): any;
    get staff(): any;
    get housekeepingTask(): any;
    get maintenanceRequest(): any;
    get notification(): any;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
