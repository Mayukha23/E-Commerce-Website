"use strict";
/*
 * spurtcommerce API
 * version 5.2.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVideo = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const moment_1 = tslib_1.__importDefault(require("moment"));
const ProductModel_1 = require("./ProductModel");
const class_validator_1 = require("class-validator");
let ProductVideo = class ProductVideo extends BaseModel_1.BaseModel {
    createDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.createdDate = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        });
    }
    updateDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.modifiedDate = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        });
    }
};
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    tslib_1.__metadata("design:type", Number)
], ProductVideo.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'product_id' }),
    tslib_1.__metadata("design:type", Number)
], ProductVideo.prototype, "productId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'name' }),
    tslib_1.__metadata("design:type", String)
], ProductVideo.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'path' }),
    tslib_1.__metadata("design:type", String)
], ProductVideo.prototype, "path", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'type' }),
    tslib_1.__metadata("design:type", String)
], ProductVideo.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(type => ProductModel_1.Product, product => product.productVideo),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    tslib_1.__metadata("design:type", ProductModel_1.Product)
], ProductVideo.prototype, "product", void 0);
tslib_1.__decorate([
    (0, typeorm_1.BeforeInsert)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductVideo.prototype, "createDetails", null);
tslib_1.__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ProductVideo.prototype, "updateDetails", null);
ProductVideo = tslib_1.__decorate([
    (0, typeorm_1.Entity)('product_video')
], ProductVideo);
exports.ProductVideo = ProductVideo;
//# sourceMappingURL=ProductVideo.js.map