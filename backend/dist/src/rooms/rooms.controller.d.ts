import { RoomsService } from './rooms.service';
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    findAll(status?: string): any;
    findOne(id: string): any;
    updateStatus(id: string, status: string): Promise<any>;
    seed(): Promise<{
        message: string;
    }>;
}
