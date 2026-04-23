import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.roomsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.roomsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.roomsService.updateStatus(id, status);
  }

  @Post('seed')
  seed() {
    return this.roomsService.seedRooms();
  }
}
