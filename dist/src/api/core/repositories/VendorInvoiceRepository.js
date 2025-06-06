"use strict";
/*
 * spurtcommerce API
 * version 5.2.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorInvoiceRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const VendorInvoice_1 = require("../models/VendorInvoice");
let VendorInvoiceRepository = class VendorInvoiceRepository extends typeorm_1.Repository {
};
VendorInvoiceRepository = tslib_1.__decorate([
    (0, typeorm_1.EntityRepository)(VendorInvoice_1.VendorInvoice)
], VendorInvoiceRepository);
exports.VendorInvoiceRepository = VendorInvoiceRepository;
//# sourceMappingURL=VendorInvoiceRepository.js.map