import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CustomersService } from './customers.service';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any) {
    console.log('🔥 RECEIVED EVENT - Raw data:', data);
    console.log('🔥 Data type:', typeof data);
    console.log('🔥 Data keys:', Object.keys(data || {}));

    if (!data) {
      console.error('❌ No data received');
      return;
    }

    const { customerId, orderId, productId, status } = data;
    console.log('🔍 Extracted values:', { customerId, orderId, productId, status });

    try {
      const updated = await this.customersService.addOrderToHistory(customerId, {
        orderId,
        productId,
        status,
      });
      console.log('✅ Updated customer history:', updated);
    } catch (error) {
      console.error('❌ Error updating customer history:', error);
    }
  }
}