/*
 * spurtcommerce API
 * version 5.2.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { OrderStatusToFullfillment } from '../models/OrderStatusToFullfillment';

@EntityRepository(OrderStatusToFullfillment)
export class OrderStatusToFullfillmentRepository extends Repository<OrderStatusToFullfillment> {
    // --
}
