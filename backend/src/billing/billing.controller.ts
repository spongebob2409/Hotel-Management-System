import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.billingService.findAll(status);
  }

  @Get('summary')
  getSummary() {
    return this.billingService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Patch(':id/pay')
  markPaid(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod?: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.billingService.markPaid(id, paymentMethod);
  }
}
