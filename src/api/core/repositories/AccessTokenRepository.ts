/*
 * spurtcommerce API
 * version 5.2.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { AccessToken } from '../models/AccessTokenModel';

@EntityRepository(AccessToken)
export class AccessTokenRepository extends Repository<AccessToken>  {

}
