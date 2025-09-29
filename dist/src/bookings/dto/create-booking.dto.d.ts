import { Attire } from '@prisma/client';
export declare class CreateBookingDto {
    companyId: string;
    date: string;
    time: string;
    duration: number;
    numGuards?: number;
    attire?: Attire;
    vehicleType: string;
    pickupLocation: string;
    pickupLat?: number;
    pickupLng?: number;
    dropoffLocation: string;
    dropoffLat?: number;
    dropoffLng?: number;
    specialRequests?: string;
    totalPrice?: number;
}
