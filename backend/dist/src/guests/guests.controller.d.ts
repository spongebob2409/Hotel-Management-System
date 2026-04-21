import { GuestsService } from './guests.service';
export declare class GuestsController {
    private guestsService;
    constructor(guestsService: GuestsService);
    findAll(search?: string): any;
    findOne(id: string): Promise<any>;
    updateVip(id: string, vipStatus: boolean): any;
}
