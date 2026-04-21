import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './booking.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(status?: string): any;
    findOne(id: string): Promise<any>;
    create(dto: CreateBookingDto): Promise<any>;
    checkIn(id: string): Promise<any>;
    checkOut(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
}
