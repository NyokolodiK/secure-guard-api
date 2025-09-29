"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding ...');
    console.log('Cleaning up database...');
    await prisma.companyReview.deleteMany({});
    await prisma.guardReview.deleteMany({});
    await prisma.bookingGuard.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.guard.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('Creating companies...');
    const company1 = await prisma.company.create({
        data: {
            name: 'Alpha Security',
            description: 'Top-tier executive protection services.',
            email: 'contact@alphasecurity.com',
            address: '123 Alpha St, Metropolis',
            rating: 4.8,
            reviewCount: 150,
            verified: true,
        },
    });
    const company2 = await prisma.company.create({
        data: {
            name: 'Bravo Protection Group',
            description: 'Discreet and professional security solutions.',
            email: 'info@bravoprotection.com',
            address: '456 Bravo Ave, Gotham City',
            rating: 4.6,
            reviewCount: 95,
            verified: true,
        },
    });
    console.log('Creating users...');
    const systemAdmin = await prisma.user.create({
        data: {
            email: 'admin@system.com',
            password: hashedPassword,
            firstName: 'System',
            lastName: 'Admin',
            userType: client_1.UserType.SYSTEM_ADMIN,
            isEmailVerified: true,
        },
    });
    const company1Admin = await prisma.user.create({
        data: {
            email: 'admin@alphasecurity.com',
            password: hashedPassword,
            firstName: 'Alice',
            lastName: 'Johnson',
            userType: client_1.UserType.COMPANY_ADMIN,
            companyId: company1.id,
            isEmailVerified: true,
        },
    });
    const client1 = await prisma.user.create({
        data: {
            email: 'client1@test.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            userType: client_1.UserType.CLIENT,
            isEmailVerified: true,
        },
    });
    console.log('Creating guards...');
    const guard1 = await prisma.guard.create({
        data: {
            companyId: company1.id,
            firstName: 'Mike',
            lastName: 'Ross',
            email: 'm.ross@alphasecurity.com',
            rating: 4.9,
            reviewCount: 50,
            status: client_1.GuardStatus.AVAILABLE,
            bio: '10 years of experience in personal security.',
        },
    });
    const guard2 = await prisma.guard.create({
        data: {
            companyId: company2.id,
            firstName: 'Harvey',
            lastName: 'Specter',
            email: 'h.specter@bravoprotection.com',
            rating: 4.7,
            reviewCount: 30,
            status: client_1.GuardStatus.AVAILABLE,
            bio: 'Former military, specializes in threat assessment.',
        },
    });
    console.log('Creating bookings...');
    const booking1 = await prisma.booking.create({
        data: {
            clientId: client1.id,
            companyId: company1.id,
            status: client_1.BookingStatus.COMPLETED,
            date: '2023-10-26',
            time: '14:00',
            duration: 4,
            numGuards: 1,
            attire: client_1.Attire.SUIT,
            vehicleType: 'Sedan',
            pickupLocation: 'Client HQ',
            dropoffLocation: 'Gala Event',
            totalPrice: 400,
        },
    });
    console.log('Creating reviews...');
    await prisma.companyReview.create({
        data: {
            bookingId: booking1.id,
            companyId: company1.id,
            clientId: client1.id,
            rating: 5,
            comment: 'Excellent service, very professional. Mike was outstanding.',
        },
    });
    await prisma.guardReview.create({
        data: {
            bookingId: booking1.id,
            guardId: guard1.id,
            clientId: client1.id,
            rating: 5,
            comment: 'Mike was punctual, professional, and made me feel completely safe.',
        },
    });
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map