import { IoTService } from './iot.service';
export declare class IoTController {
    private iotService;
    constructor(iotService: IoTService);
    getEvents(limit?: string): any;
    getSensors(): any;
    getParkingSessions(): any;
    handleEvent(payload: {
        sensorRef: string;
        eventType: string;
        data?: any;
    }): Promise<any>;
    resolveEvent(id: string): any;
    seedSensors(): Promise<{
        message: string;
    }>;
}
