import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('guests')
export class GuestsController {
  constructor(private guestsService: GuestsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.guestsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(id);
  }

  @Patch(':id/vip')
  updateVip(@Param('id') id: string, @Body('vipStatus') vipStatus: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.guestsService.updateVip(id, vipStatus);
  }
}
