import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GuestsModule } from './guests/guests.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { BillingModule } from './billing/billing.module';
import { StaffModule } from './staff/staff.module';
import { HousekeepingModule } from './housekeeping/housekeeping.module';
import { IoTModule } from './iot/iot.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GuestsModule,
    RoomsModule,
    BookingsModule,
    BillingModule,
    StaffModule,
    HousekeepingModule,
    IoTModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
