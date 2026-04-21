export declare class CreateBookingDto {
    guestId: string | undefined;
    roomId: string | undefined;
    checkIn: string | undefined;
    checkOut: string | undefined;
    adults?: number;
    children?: number;
    parkingEnabled?: boolean;
    notes?: string;
    paymentMethod?: string;
}
