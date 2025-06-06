"use strict";
/*
 * spurtcommerce API
 * version 5.2.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVendorGroup = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const class_validator_1 = require("class-validator");
class CreateVendorGroup {
}
tslib_1.__decorate([
    (0, class_validator_1.MaxLength)(30, {
        message: 'name should be maximum 30 characters',
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: 'name is required',
    }),
    tslib_1.__metadata("design:type", String)
], CreateVendorGroup.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: 'status is required',
    }),
    tslib_1.__metadata("design:type", Number)
], CreateVendorGroup.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], CreateVendorGroup.prototype, "commission", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], CreateVendorGroup.prototype, "categoryIds", void 0);
exports.CreateVendorGroup = CreateVendorGroup;
//# sourceMappingURL=CreateVendorGroupRequest.js.map