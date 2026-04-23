import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IoTService } from './iot.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('iot')
export class IoTController {
  constructor(private iotService: IoTService) {}

  @Get('events')
  getEvents(@Query('limit') limit?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.iotService.getEvents(limit ? parseInt(limit) : 50);
  }

  @Get('sensors')
  getSensors() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.iotService.getSensors();
  }

  @Get('parking')
  getParkingSessions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.iotService.getParkingSessions();
  }

  @Post('event')
  handleEvent(
    @Body() payload: { sensorRef: string; eventType: string; data?: any },
  ) {
    return this.iotService.handleEvent(payload);
  }

  @Patch('events/:id/resolve')
  resolveEvent(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.iotService.resolveEvent(id);
  }

  @Post('seed')
  seedSensors() {
    return this.iotService.seedSensors();
  }
}
