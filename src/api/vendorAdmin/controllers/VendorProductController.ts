/*
 * spurtcommerce API
 * version 5.2.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {
    JsonController,
    Authorized,
    Res,
    Body,
    Post,
    Req,
    Put,
    Param,
    Get,
    QueryParam,
    BodyParam,
} from 'routing-controllers';
import { ProductService } from '../../core/services/ProductService';
import { ProductToCategoryService } from '../../core/services/ProductToCategoryService';
import { ProductImageService } from '../../core/services/ProductImageService';
import { Product } from '../../core/models/ProductModel';
import { ProductDiscount } from '../../core/models/ProductDiscount';
import { ProductSpecial } from '../../core/models/ProductSpecial';
import { VendorProducts } from '../../core/models/VendorProducts';
import { CreateVendorProductRequest } from './requests/CreateVendorProductRequest';
import { ProductToCategory } from '../../core/models/ProductToCategory';
import { ProductImage } from '../../core/models/ProductImage';
import { CategoryService } from '../../core/services/CategoryService';
import { CategoryPathService } from '../../core/services/CategoryPathService';
import { VendorProductService } from '../../core/services/VendorProductService';
import { ProductDiscountService } from '../../core/services/ProductDiscountService';
import { ProductSpecialService } from '../../core/services/ProductSpecialService';
import { VendorService } from '../../core/services/VendorService';
import { CustomerService } from '../../core/services/CustomerService';
import moment = require('moment');
import { instanceToPlain } from 'class-transformer';
import fs = require('fs');
import { EmailTemplateService } from '../../core/services/EmailTemplateService';
import { SettingService } from '../../core/services/SettingService';
import { MAILService } from '../../../auth/mail.services';
import { TaxService } from '../../core/services/TaxService';
import { env } from '../../../env';
import { SkuService } from '../../core/services/SkuService';
import { Sku } from '../../core/models/SkuModel';
import { ProductVideo } from '../../core/models/ProductVideo';
import { ProductVideoService } from '../../core/services/ProductVideoService';
import { ProductTirePrice } from '../../core/models/ProductTirePrice';
import { ProductTirePriceService } from '../../core/services/ProductTirePriceService';
import { ImageService } from '../../core/services/ImageService';
// import { vendorProductList } from '@spurtcommerce/marketplace';
// import { getConnection } from 'typeorm';
@JsonController('/admin-vendor-product')
export class VendorAdminProductController {
    constructor(
        private productService: ProductService,
        private productToCategoryService: ProductToCategoryService,
        private productImageService: ProductImageService,
        private categoryService: CategoryService,
        private productDiscountService: ProductDiscountService,
        private productSpecialService: ProductSpecialService,
        private vendorProductService: VendorProductService,
        private vendorService: VendorService,
        private emailTemplateService: EmailTemplateService,
        private settingService: SettingService,
        private taxService: TaxService,
        private categoryPathService: CategoryPathService,
        private skuService: SkuService,
        private productVideoService: ProductVideoService,
        private customerService: CustomerService,
        private productTirePriceService: ProductTirePriceService,
        private imageService: ImageService
    ) {
    }

    // Create Product API
    /**
     * @api {post} /api/admin-vendor-product Create Vendor Product API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} vendorId vendorId
     * @apiParam (Request body) {String{..255}} productName productName
     * @apiParam (Request body) {String} [productDescription] productDescription
     * @apiParam (Request body) {String{..64}} sku stock keeping unit
     * @apiParam (Request body) {String{..12}} upc upc
     * @apiParam (Request body) {String{..64}} hsn hsn
     * @apiParam (Request body) {String} image product Image
     * @apiParam (Request body) {String{..255}} productSlug productSlug
     * @apiParam (Request body) {Number} quantity quantity
     * @apiParam (Request body) {Number} [packingCost] packingCost
     * @apiParam (Request body) {Number} [shippingCost] shippingCost
     * @apiParam (Request body) {Number} [tax] tax
     * @apiParam (Request body) {Number} [taxType] taxType
     * @apiParam (Request body) {Number} [others] others
     * @apiParam (Request body) {String} categoryId CategoryId
     * @apiParam (Request body) {Number} price price
     * @apiParam (Request body) {Number} [outOfStockStatus] outOfStockStatus
     * @apiParam (Request body) {Number} [requiredShipping] requiredShipping
     * @apiParam (Request body) {String} [dateAvailable] dateAvailable
     * @apiParam (Request body) {Number{..9999}} [sortOrder] sortOrder
     * @apiParam (Request body) {String} [productSpecial] productSpecial
     * @apiParam (Request body) {String} [tirePrices] tirePrices
     * @apiParam (Request body) {Number} [hasTirePrice]
     * @apiParam (Request body) {Number} [quotationAvailable]
     * @apiParam (Request body) {String} [productDiscount] productDiscount
     * @apiParam (Request body) {Number} [vendorProductCommission] vendorProductCommission
     * @apiParam (Request body) {Object} [productVideo] video
     * @apiParam (Request body) {String} productVideo.name video name
     * @apiParam (Request body) {String} productVideo.path for embedded have to pass path only
     * @apiParam (Request body) {Number} productVideo.type 1 -> video 2 -> embedded
     * @apiParamExample {json} Input
     * {
     *      "vendorId" : "",
     *      "productName" : "",
     *      "productDescription" : "",
     *      "sku" : "",
     *      "hsn" : "",
     *      "image" : "",
     *      "categoryId" : [],
     *      "productSlug" : "",
     *      "upc" : "",
     *      "price" : "",
     *      "packingCost" : "",
     *      "shippingCost" : "",
     *      "tax" : "",
     *      "taxType" : "",
     *      "others" : "",
     *      "outOfStockStatus" : "",
     *      "requiredShipping" : "",
     *      "dateAvailable" : "",
     *      "outOfStockStatus" : "",
     *      "sortOrder" : "",
     *      "vendorProductCommission" : "",
     *      "image":[
     *      {
     *      "image":""
     *      "containerName":""
     *      "defaultImage":""
     *      }
     *      ]
     *     "relatedProductId":[ ],
     *      "hasTirePrice" : "",
     *      "tirePrices":[
     *      {
     *      "quantity":""
     *      "price":"",
     *      "skuName":""
     *      }
     *      ],
     *     "productSpecial":[
     *      {
     *     "customerGroupId":""
     *     "specialPriority":""
     *     "specialPrice":""
     *     "specialDateStart":""
     *     "specialDateEnd":""
     *      }]
     *     "productDiscount":[
     *      {
     *         "discountPriority":""
     *         "discountPrice":""
     *         "discountDateStart":""
     *         "discountDateEnd"""
     *      }],
     *      "productVideo":{
     *               "name": "",
     *               "path": "",
     *               "type": ""
     *      },
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully created new Vendor product.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin-vendor-product
     * @apiErrorExample {json} Vendor Product error
     * HTTP/1.1 500 Internal Server Error
     */
    @Post()
    @Authorized(['admin', 'create-market-place-product'])
    public async createProduct(@Body({ validate: true }) product: CreateVendorProductRequest, @Req() req: any, @Res() response: any): Promise<any> {
        console.log('vendorId:', product.vendorId);
        const category = product.categoryId;
        if (category.length === 0) {
            return response.status(400).send({
                status: 0,
                message: 'Category should not be empty',
            });
        }
        if ((product.price < 0)) {
            const errorResponse: any = {
                status: 0,
                message: 'Price should not be in negative',
            };
            return response.status(400).send(errorResponse);
        }
        if ((product.tax < 0)) {
            const errorResponse: any = {
                status: 0,
                message: 'Tax should not be in negative',
            };
            return response.status(400).send(errorResponse);
        }
        const newProduct: any = new Product();
        if (+newProduct.price === 0) {
            return response.status(400).send({
                status: 0,
                message: 'Product price input is missing',
            });
        }
        const productImage: any = product.image;
        if (productImage.length === 0) {
            return response.status(400).send({
                status: 0,
                message: 'Error ! Atleast one selection is mandatory',
            });
        }
        newProduct.name = product.productName;
        newProduct.description = product.productDescription ? await this.imageService.escapeChar(product.productDescription) : '';
        const metaTagTitle = product.productSlug ? product.productSlug : product.productName;
        const slug = metaTagTitle.trim();
        const data = slug.replace(/\s+/g, '-').replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, '').toLowerCase();
        newProduct.productSlug = await this.validate_slug(data);
        newProduct.sku = product.sku;
        newProduct.upc = product.upc;
        newProduct.hsn = product.hsn;
        newProduct.quantity = product.quantity ? product.quantity : 1;
        const serviceCharge: any = {};
        serviceCharge.productCost = product.price;
        serviceCharge.packingCost = product.packingCost ? product.packingCost : 0;
        serviceCharge.shippingCost = product.shippingCost ? product.shippingCost : 0;
        serviceCharge.tax = 0;
        serviceCharge.others = product.others ? product.others : 0;
        newProduct.serviceCharges = JSON.stringify(serviceCharge);
        newProduct.price = serviceCharge.productCost + serviceCharge.packingCost + serviceCharge.shippingCost + serviceCharge.others;
        newProduct.taxType = product.taxType ? product.taxType : 0;
        newProduct.taxValue = product.tax ? product.tax : 0;
        newProduct.stockStatusId = product.outOfStockStatus ? product.outOfStockStatus : 1;
        newProduct.quotationAvailable = product.quotationAvailable ? product.quotationAvailable : 0;
        newProduct.shipping = product.requiredShipping;
        newProduct.dateAvailable = moment(product.dateAvailable).toISOString();
        const findSku = await this.skuService.findOne({ where: { skuName: product.sku } });
        if (findSku) {
            const errorResponse: any = {
                status: 0,
                message: 'Duplicate SKU name, give some other name',
            };
            return response.status(400).send(errorResponse);
        }
        const newSku: any = new Sku();
        newSku.skuName = product.sku;
        newSku.price = newProduct.price;
        newSku.quantity = product.quantity ? product.quantity : 1;
        newSku.isActive = 1;
        const saveSku = await this.skuService.create(newSku);
        newProduct.skuId = saveSku.id;
        newProduct.hasTirePrice = product.hasTirePrice ? product.hasTirePrice : 0;
        newProduct.isActive = 0;
        newProduct.isFeatured = 0;
        newProduct.todayDeals = 0;
        newProduct.sortOrder = product.sortOrder;
        newProduct.height = (product && product.height) ? product.height : 0;
        newProduct.weight = (product && product.weight) ? product.weight : 0;
        newProduct.length = (product && product.length) ? product.length : 0;
        newProduct.width = (product && product.width) ? product.width : 0;
        // adding category name and product name in keyword field for keyword search
        const rows: any = [];
        if (category.length !== 0) {
            for (const categoryId of category) {
                const categoryNames: any = await this.categoryService.findOne({
                    where: {
                        categoryId,
                    },
                });
                const name = '~' + categoryNames.name + '~';
                rows.push(name);
            }
            rows.push('~' + product.productName + '~');
        }
        const value = rows.toString();
        newProduct.keywords = value;
        newProduct.owner = 2;
        newProduct.createdBy = product.vendorId;
        const saveProduct = await this.productService.create(newProduct);

        // save category
        if (category.length !== 0) {
            for (const categoryId of category) {
                const newProductToCategory: any = new ProductToCategory();
                newProductToCategory.productId = saveProduct.productId;
                newProductToCategory.categoryId = categoryId;
                newProductToCategory.isActive = 1;
                await this.productToCategoryService.create(newProductToCategory);
            }
        }

        // Save products Image
        for (const imageRow of productImage) {
            const imageData = JSON.stringify(imageRow);
            const imageResult = JSON.parse(imageData);
            const newProductImage = new ProductImage();
            newProductImage.productId = saveProduct.productId;
            newProductImage.image = imageResult.image;
            newProductImage.containerName = imageResult.containerName;
            newProductImage.defaultImage = imageResult.defaultImage;
            await this.productImageService.create(newProductImage);
        }

        // save product Video
        if (product.productVideo) {
            const video = product.productVideo;
            const productVideo: any = new ProductVideo();
            productVideo.productId = saveProduct.productId;
            productVideo.name = video.name;
            productVideo.path = video.path;
            productVideo.type = video.type;
            await this.productVideoService.create(productVideo);
        }
        saveProduct.isSimplified = 1;
        await this.productService.create(saveProduct);
        // Product Discount
        if (product.productDiscount) {
            const productDiscount: any = product.productDiscount;
            for (const discount of productDiscount) {
                const discountData: any = new ProductDiscount();
                discountData.productId = saveProduct.productId;
                discountData.quantity = 1;
                discountData.priority = discount.discountPriority;
                discountData.price = discount.discountPrice;
                discountData.dateStart = moment(discount.discountDateStart).toISOString();
                discountData.dateEnd = moment(discount.discountDateEnd).toISOString();
                await this.productDiscountService.create(discountData);
            }
        }

        // Product Special
        if (product.productSpecial) {
            const productSpecial: any[] = product.productSpecial;
            for (const special of productSpecial) {
                const specialPriceData: any = new ProductSpecial();
                specialPriceData.productId = saveProduct.productId;
                specialPriceData.priority = special.specialPriority;
                specialPriceData.price = special.specialPrice;
                specialPriceData.dateStart = moment(special.specialDateStart).toISOString();
                specialPriceData.dateEnd = moment(special.specialDateEnd).toISOString();
                await this.productSpecialService.create(specialPriceData);
            }
        }
        // product tire price
        if (product.tirePrices) {
            const tirePrice: any = product.tirePrices;
            for (const tire of tirePrice) {
                const productTirePrice: any = new ProductTirePrice();
                productTirePrice.productId = saveProduct.productId;
                productTirePrice.quantity = tire.quantity;
                productTirePrice.price = tire.price;
                await this.productTirePriceService.create(productTirePrice);
            }
        }
        const vendorProducts: any = new VendorProducts();
        vendorProducts.productId = saveProduct.productId;
        vendorProducts.sku_id = saveSku.id;
        vendorProducts.vendorId = product.vendorId;
        vendorProducts.approvalFlag = 0;
        vendorProducts.rejectReason = [];
        vendorProducts.vendorProductCommission = product.vendorProductCommission ? product.vendorProductCommission : 0;
        await this.vendorProductService.create(vendorProducts);
        if (saveProduct) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully created the product',
                data: saveProduct,
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Unable to create the product',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // update Product API
    /**
     * @api {put} /api/admin-vendor-product/:id Update Vendor Product API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} vendorId vendorId
     * @apiParam (Request body) {String{..255}} productName productName
     * @apiParam (Request body) {String} [productDescription] productDescription
     * @apiParam (Request body) {String{..64}} sku stock keeping unit
     * @apiParam (Request body) {String{..12}} upc upc
     * @apiParam (Request body) {String{..255}} hsn hsn
     * @apiParam (Request body) {String} image product Image
     * @apiParam (Request body) {String} productSlug productSlug
     * @apiParam (Request body) {Number} quantity quantity
     * @apiParam (Request body) {String} categoryId CategoryId
     * @apiParam (Request body) {String} [relatedProductId] relatedProductId
     * @apiParam (Request body) {Number} price price
     * @apiParam (Request body) {Number} [packingCost] packingCost
     * @apiParam (Request body) {Number} [shippingCost] shippingCost
     * @apiParam (Request body) {Number} [tax] tax
     * @apiParam (Request body) {Number} [taxType] taxType
     * @apiParam (Request body) {Number} [others] others
     * @apiParam (Request body) {Number} [outOfStockStatus] outOfStockStatus
     * @apiParam (Request body) {Number} [requiredShipping] requiredShipping
     * @apiParam (Request body) {String} [dateAvailable] dateAvailable
     * @apiParam (Request body) {Number{..9999}} sortOrder sortOrder
     * @apiParam (Request body) {String} [productSpecial] productSpecial
     * @apiParam (Request body) {String} [tirePrices] tirePrices
     * @apiParam (Request body) {Number} [hasTirePrice]
     * @apiParam (Request body) {String} [productDiscount] productDiscount
     * @apiParam (Request body) {Number} [vendorProductCommission] vendorProductCommission
     * @apiParam (Request body) {Object} [productVideo] video
     * @apiParam (Request body) {String} productVideo.name video name
     * @apiParam (Request body) {String} productVideo.path for embedded have to pass path only
     * @apiParam (Request body) {Number} productVideo.type 1 -> video 2 -> embedded
     * @apiParamExample {json} Input
     * {
     *      "productName" : "",
     *      "productDescription" : "",
     *      "sku" : "",
     *      "image" : "",
     *      "categoryId" : [],
     *      "upc" : "",
     *      "hsn" : "",
     *      "price" : "",
     *      "packingCost" : "",
     *      "shippingCost" : "",
     *      "tax" : "",
     *      "taxType" : "",
     *      "others" : "",
     *      "outOfStockStatus" : "",
     *      "requiredShipping" : "",
     *      "dateAvailable" : "",
     *      "outOfStockStatus" : "",
     *      "sortOrder" : "",
     *      "vendorProductCommission" : "",
     *      "image":[
     *      {
     *      "image":""
     *      "containerName":""
     *      "defaultImage":""
     *      }
     *      ],
     *       "relatedProductId":[],
     *      "hasTirePrice" : "",
     *      "tirePrices":[
     *      {
     *      "quantity":""
     *      "price":"",
     *      "skuName":""
     *      }
     *      ],
     *      "productSpecial":[
     *      {
     *     "customerGroupId":""
     *     "specialPriority":""
     *     "specialPrice":""
     *     "specialDateStart":""
     *     "specialDateEnd":""
     *      }],
     *       "productDiscount":[
     *      {
     *         "discountPriority":""
     *         "discountPrice":""
     *         "discountDateStart":""
     *         "discountDateEnd"""
     *      }],
     *       "productVideo":{
     *               "name": "",
     *               "path": "",
     *               "type": ""
     *      }
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated product.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin-vendor-product/:id
     * @apiErrorExample {json} updateProduct error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/:id')
    @Authorized(['admin', 'edit-market-place-product'])
    public async updateProduct(@Param('id') id: number, @Body({ validate: true }) product: CreateVendorProductRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const category = product.categoryId;
        if (category.length === 0) {
            return response.status(400).send({
                status: 0,
                message: 'Category should not be empty',
            });
        }
        let validatedDiscount = false;
        let validatedSpecial = false;
        const validateDiscountPrice: any = product.productDiscount;
        if (validateDiscountPrice.length > 0) {
            validatedDiscount = validateDiscountPrice.some(discData => discData.discountPrice < 0);
        }
        const validateSpecialPrice: any = product.productSpecial;
        if (validateSpecialPrice.length > 0) {
            validatedSpecial = validateSpecialPrice.some(specialData => specialData.specialPrice < 0);
        }
        if (validatedDiscount || validatedSpecial || (product.price < 0)) {
            const errorResponse: any = {
                status: 0,
                message: 'Price should not be in negative',
            };
            return response.status(400).send(errorResponse);
        }
        if ((product.tax < 0)) {
            const errorResponse: any = {
                status: 0,
                message: 'Tax should not be in negative',
            };
            return response.status(400).send(errorResponse);
        }
        const updateProduct: any = await this.productService.findOne({
            where: {
                productId: id,
            },
        });
        if (!updateProduct) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid product Id',
            };
            return response.status(400).send(errorResponse);
        }
        const metaTagTitle = product.productSlug ? product.productSlug : product.productName;
        const slug = metaTagTitle.trim();
        const data = slug.replace(/\s+/g, '-').replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, '').toLowerCase();
        updateProduct.productSlug = await this.validate_slug(data, id);
        updateProduct.name = product.productName;
        updateProduct.description = product.productDescription ? await this.imageService.escapeChar(product.productDescription) : '';
        updateProduct.sku = product.sku;
        updateProduct.upc = product.upc;
        updateProduct.hsn = product.hsn;
        updateProduct.quantity = product.quantity ? product.quantity : 1;
        updateProduct.hasTirePrice = product.hasTirePrice;
        const serviceCharge: any = {};
        serviceCharge.productCost = product.price;
        serviceCharge.packingCost = product.packingCost ? product.packingCost : 0;
        serviceCharge.shippingCost = product.shippingCost ? product.shippingCost : 0;
        serviceCharge.tax = 0;
        serviceCharge.others = product.others ? product.others : 0;
        updateProduct.quotationAvailable = product.quotationAvailable ? product.quotationAvailable : 0;
        updateProduct.serviceCharges = JSON.stringify(serviceCharge);
        updateProduct.price = serviceCharge.productCost + serviceCharge.packingCost + serviceCharge.shippingCost + serviceCharge.others;
        // saving sku //
        let saveSku;
        const findSku = await this.skuService.findOne({ where: { skuName: updateProduct.sku } });
        if (findSku) {
            const finddSku = await this.productService.findSkuName(updateProduct.productId, product.sku, 0);
            if (finddSku) {
                const errorResponse: any = {
                    status: 0,
                    message: 'Duplicate SKU name, give some other name',
                };
                return response.status(400).send(errorResponse);
            } else {
                findSku.skuName = updateProduct.sku;
                findSku.price = updateProduct.price;
                findSku.quantity = product.quantity;
                findSku.isActive = 1;
                saveSku = await this.skuService.create(findSku);
            }
        } else {
            const newSku: any = new Sku();
            newSku.skuName = updateProduct.sku;
            newSku.price = updateProduct.price;
            newSku.quantity = product.quantity;
            newSku.isActive = 1;
            saveSku = await this.skuService.create(newSku);
        }
        // ending sku //
        updateProduct.skuId = saveSku.id;
        updateProduct.taxType = product.taxType ? product.taxType : 0;
        updateProduct.taxValue = product.tax ? product.tax : 0;
        updateProduct.stockStatusId = product.outOfStockStatus;
        updateProduct.shipping = product.requiredShipping;
        updateProduct.dateAvailable = moment(product.dateAvailable).toISOString();
        updateProduct.sortOrder = product.sortOrder;
        updateProduct.height = product.height ? product.height : 0;
        updateProduct.weight = product.weight ? product.weight : 0;
        updateProduct.length = product.length ? product.length : 0;
        updateProduct.width = product.width ? product.width : 0;
        // adding category name and product name in keyword field for keyword search
        const rows: any = [];
        if (category.length !== 0) {
            for (const categoryId of category) {
                const categoryNames: any = await this.categoryService.findOne({
                    where: {
                        categoryId,
                    },
                });
                const name = '~' + categoryNames.name + '~';
                rows.push(name);
            }
            rows.push('~' + product.productName + '~');
        }
        const values = rows.toString();
        updateProduct.keywords = values;
        updateProduct.modifiedBy = product.vendorId;
        const vendorProductCheck = await this.vendorProductService.findOne({
            where: {
                productId: updateProduct.productId,
            },
        });
        if (vendorProductCheck) {
            vendorProductCheck.quotationAvailable = product.quotationAvailable ? product.quotationAvailable : 0;
            await this.vendorProductService.create(vendorProductCheck);
        }
        const saveProduct = await this.productService.create(updateProduct);

        // delete previous category
        this.productToCategoryService.delete({ productId: saveProduct.productId });

        // save category
        if (category.length !== 0) {
            for (const categoryId of category) {
                const newProductToCategory: any = new ProductToCategory();
                newProductToCategory.productId = saveProduct.productId;
                newProductToCategory.categoryId = categoryId;
                newProductToCategory.isActive = 1;
                this.productToCategoryService.create(newProductToCategory);
            }
        }

        // Delete previous images
        this.productImageService.delete({ productId: saveProduct.productId });
        // Save products Image
        if (product.image) {
            const productImage: any = product.image;
            for (const imageRow of productImage) {
                const imageData = JSON.stringify(imageRow);
                const imageResult = JSON.parse(imageData);
                const newProductImage = new ProductImage();
                newProductImage.productId = saveProduct.productId;
                newProductImage.image = imageResult.image;
                newProductImage.containerName = imageResult.containerName;
                newProductImage.defaultImage = imageResult.defaultImage;
                await this.productImageService.create(newProductImage);
            }
        }
        await this.productService.create(saveProduct);
        // Product Discount
        if (product.productDiscount) {
            // Delete the product discount
            this.productDiscountService.delete({ productId: saveProduct.productId });
            const productDiscount: any = product.productDiscount;
            const distArr: any = [];
            for (const discount of productDiscount) {
                const discountData: any = new ProductDiscount();
                discountData.productId = saveProduct.productId;
                if (saveProduct.price <= discount.discountPrice) {
                    const errorResponse: any = {
                        status: 0,
                        message: 'discount price should be less than original price',
                    };
                    return response.status(400).send(errorResponse);
                }
                discountData.quantity = 1;
                const skuValue: any = await this.skuService.findOne({
                    where: {
                        skuName: discount.skuName,
                    },
                });
                if (skuValue) {
                    discountData.skuId = skuValue.id;
                } else {
                    const errorResponse: any = {
                        status: 0,
                        message: 'SKU does not exist in discount price',
                    };
                    return response.status(400).send(errorResponse);
                }
                discountData.priority = discount.discountPriority;
                discountData.price = discount.discountPrice;
                discountData.dateStart = moment(discount.discountDateStart).toISOString();
                discountData.dateEnd = moment(discount.discountDateEnd).toISOString();
                distArr.push(discountData);
            }
            await this.productDiscountService.create(distArr);
        }

        // Product Special
        if (product.productSpecial) {
            this.productSpecialService.delete({ productId: saveProduct.productId });
            const productSpecial: any = product.productSpecial;
            const splArr: any = [];
            for (const special of productSpecial) {
                const specialPriceData: any = new ProductSpecial();
                specialPriceData.productId = saveProduct.productId;
                if (saveProduct.price <= special.specialPrice) {
                    const errorResponse: any = {
                        status: 0,
                        message: 'special price should be less than original price',
                    };
                    return response.status(400).send(errorResponse);
                }
                specialPriceData.customerGroupId = special.customerGroupId;
                const specialSkuValue: any = await this.skuService.findOne({
                    where: {
                        skuName: special.skuName,
                    },
                });
                if (specialSkuValue) {
                    specialPriceData.skuId = specialSkuValue.id;
                } else {
                    const errorResponse: any = {
                        status: 0,
                        message: 'SKU does not exist in special price',
                    };
                    return response.status(400).send(errorResponse);
                }
                specialPriceData.priority = special.specialPriority;
                specialPriceData.price = special.specialPrice;
                specialPriceData.dateStart = moment(special.specialDateStart).toISOString();
                specialPriceData.dateEnd = moment(special.specialDateEnd).toISOString();
                splArr.push(specialPriceData);
            }
            await this.productSpecialService.create(splArr);
        }
        // product tire price
        if (product.tirePrices) {
            await this.productTirePriceService.delete({ productId: saveProduct.productId });
            const tirePrice: any = product.tirePrices;
            const tireArr: any = [];
            for (const tire of tirePrice) {
                const productTirePrice: any = new ProductTirePrice();
                productTirePrice.productId = saveProduct.productId;
                const tireSkuValue: any = await this.skuService.findOne({
                    where: {
                        skuName: tire.skuName,
                    },
                });
                if (tireSkuValue) {
                    productTirePrice.skuId = tireSkuValue.id;
                } else {
                    const errorResponse: any = {
                        status: 0,
                        message: ' This SKU does not exist',
                    };
                    return response.status(400).send(errorResponse);
                }
                productTirePrice.quantity = tire.quantity;
                productTirePrice.price = tire.price;
                tireArr.push(productTirePrice);
            }
            await this.productTirePriceService.create(tireArr);
        }

        // update product Video
        const video = product.productVideo;
        if (video) {
            await this.productVideoService.delete({ productId: saveProduct.productId });
            const newProductVideo: any = new ProductVideo();
            newProductVideo.productId = saveProduct.productId;
            newProductVideo.name = video.name;
            newProductVideo.type = video.type;
            newProductVideo.path = video.path;
            await this.productVideoService.create(newProductVideo);
        }
        const vendorProduct: any = await this.vendorProductService.findOne({
            where: {
                productId: id,
            },
        });
        vendorProduct.vendorId = product.vendorId;
        vendorProduct.sku_id = saveSku.id;
        vendorProduct.vendorProductCommission = product.vendorProductCommission ? product.vendorProductCommission : 0;
        await this.vendorProductService.create(vendorProduct);
        if (saveProduct) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully updated the seller product',
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Unable to update the seller product.',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Product List API
    /**
     * @api {get} /api/admin-vendor-product Vendor Product List API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {String} status 0-> inactive 1-> active
     * @apiParam (Request body) {String} vendorId vendorId
     * @apiParam (Request body) {String} keyword keyword
     * @apiParam (Request body) {String} price price
     * @apiParam (Request body) {Number} count count
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get vendor product list",
     *       "data": {
     *       "vendorProductId": 717,
     *       "vendorProductCommission": "",
     *       "quotationAvailable": "",
     *       "approvalFlag": "",
     *       "vendorId": "",
     *       "companyLogo": "",
     *       "companyLogoPath": "",
     *       "productId": "",
     *       "name": "",
     *       "sku": "",
     *       "skuId": ,
     *       "productprice": "",
     *       "quantity": "",
     *       "vendorName": "",
     *       "companyName": "",
     *       "sortOrder": "",
     *       "isActive": "",
     *       "productSlug": "",
     *       "width": "",
     *       "height": "",
     *       "length": "",
     *       "weight": "",
     *       "createdDate": "",
     *       "keywords": "",
     *       "isSimplified": ,
     *       "attributeKeyword": "",
     *       "image": "",
     *       "containerName": "",
     *       "price": "",
     *       "modifiedPrice": "",
     *       "productDiscount": "",
     *       "productSpecial": "",
     *       "pricerefer": "",
     *       "flag": ""
     *   }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin-vendor-product
     * @apiErrorExample {json} vendor error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get()
    @Authorized()
    public async vendorProductList(
        @QueryParam('limit') limit: number,
        @QueryParam('offset') offset: number,
        @QueryParam('status') status: string,
        @QueryParam('vendorId') vendorId: string,
        @QueryParam('keyword') keyword: string,
        @QueryParam('price') price: string,
        @QueryParam('approvalFlag') approvalFlag: string,
        @QueryParam('vendorName') vendorName: string,
        @QueryParam('updatedDate') updatedDate: string,
        @QueryParam('companyName') companyName: string,
        @QueryParam('productName') productName: string,
        @QueryParam('count') count: number,
        @Res() response: any
    ): Promise<any> {
        const selects = ['VendorProducts.vendorProductId as vendorProductId',
            'VendorProducts.vendorProductCommission as vendorProductCommission',
            'VendorProducts.quotationAvailable as quotationAvailable',
            'VendorProducts.approvalFlag as approvalFlag',
            'VendorProducts.rejectReason as rejectReason',
            'vendor.vendorId as vendorId',
            'vendor.companyLogo as companyLogo',
            'vendor.companyLogoPath as companyLogoPath',
            'product.productId as productId',
            'product.name as name',
            'product.sku as sku',
            'product.skuId as skuId',
            'product.price as productprice',
            'product.quantity as quantity',
            'customer.firstName as vendorName',
            'vendor.companyName as companyName',
            'product.sortOrder as sortOrder',
            'product.isActive as isActive',
            'product.productSlug as productSlug',
            'product.width as width',
            'product.height as height',
            'product.length as length',
            'product.weight as weight',
            'VendorProducts.createdDate as createdDate',
            'VendorProducts.modifiedDate as modifiedDate',
            'product.keywords as keywords',
            'product.isSimplified as isSimplified',
            'product.attributeKeyword as attributeKeyword',
            '(SELECT pi.image as image FROM product_image pi WHERE pi.product_id = product.productId AND pi.default_image = 1 LIMIT 1) as image',
            '(SELECT pi.container_name as containerName FROM product_image pi WHERE pi.product_id = product.productId AND pi.default_image = 1 LIMIT 1) as containerName',
            '(SELECT sku.sku_name as sku FROM sku WHERE sku.id = skuId) as sku',
            '(SELECT sku.price as price FROM sku WHERE sku.id = skuId) as price',
            '(SELECT sku.price as price FROM sku WHERE sku.id = skuId) as modifiedPrice',
            '(SELECT price FROM product_discount pd2 WHERE pd2.product_id = product.product_id AND pd2.sku_id = skuId AND ((pd2.date_start <= CURDATE() AND  pd2.date_end >= CURDATE())) ' +
            'ORDER BY pd2.priority ASC, pd2.price ASC LIMIT 1) AS productDiscount',
            '(SELECT price FROM product_special ps WHERE ps.product_id = product.product_id AND ps.sku_id = skuId AND ((ps.date_start <= CURDATE() AND ps.date_end >= CURDATE()))' + ' ' + 'ORDER BY ps.priority ASC, ps.price ASC LIMIT 1) AS productSpecial',
        ];
        const whereConditions = [];
        const relations = [];
        const groupBy = [];
        relations.push({
            tableName: 'VendorProducts.product',
            aliasName: 'product',
        },
            {
                tableName: 'VendorProducts.vendor',
                aliasName: 'vendor',
            },
            {
                tableName: 'vendor.customer',
                aliasName: 'customer',
            });
        if (status && status !== '') {
            whereConditions.push({
                name: 'product.isActive',
                op: 'and',
                value: +status,
            });
        }
        if (+vendorId && vendorId !== '') {
            whereConditions.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: +vendorId,
            });
        }
        whereConditions.push(
            // {
            //     name: 'VendorProducts.reuse',
            //     op: 'IS NULL',
            //     value: '',
            // },
            {
                name: 'VendorProducts.reuseStatus',
                op: 'and',
                value: 0,
            },
            {
                name: 'vendor.isDelete',
                op: 'and',
                value: 0,
            }
        );

        if (approvalFlag) {
            whereConditions.push(
                {
                    name: 'VendorProducts.approvalFlag',
                    op: 'and',
                    value: +approvalFlag,
                }
            );
        }

        const searchConditions = [];
        if (keyword) {
            searchConditions.push({
                name: ['product.keywords', 'product.name', 'customer.first_name', 'vendor.companyName'],
                value: keyword.toLowerCase(),
            });
        }
        if (vendorName?.trim()) {
            searchConditions.push({
                name: ['customer.first_name', 'customer.last_name'],
                value: vendorName.toLowerCase(),
            });
        }
        if (companyName?.trim()) {
            searchConditions.push({
                name: ['vendor.companyName'],
                value: companyName.toLowerCase(),
            });
        }
        if (productName?.trim()) {
            searchConditions.push({
                name: ['product.name'],
                value: productName.toLowerCase(),
            });
        }
        if (updatedDate) {
            searchConditions.push({
                name: ['VendorProducts.modifiedDate'],
                value: updatedDate,
            });
        }
        const sort = [];
        sort.push({
            name: 'VendorProducts.createdDate',
            order: 'DESC',
        });
        if (count) {
            const vendorProductListCount: any = await this.vendorProductService.listByQueryBuilder(limit, offset, selects, whereConditions, searchConditions, relations, groupBy, sort, true, true);
            const sucResponse: any = {
                status: 1,
                message: 'Successfully got seller product list',
                data: vendorProductListCount,
            };
            return response.status(200).send(sucResponse);
        }
        const vendorProductsList: any = await this.vendorProductService.listByQueryBuilder(limit, offset, selects, whereConditions, searchConditions, relations, groupBy, sort, false, true);
        const productList = vendorProductsList.map(async (value: any) => {
            const temp: any = value;
            if (value.productSpecial !== null) {
                temp.pricerefer = value.productSpecial;
                temp.flag = 1;
            } else if (value.productDiscount !== null) {
                temp.pricerefer = value.productDiscount;
                temp.flag = 0;
            } else {
                temp.pricerefer = '';
                temp.flag = '';
            }
            return temp;
        });
        const results = await Promise.all(productList);

        const successResponse: any = {
            status: 1,
            message: 'Successfully got seler product list',
            data: results,
        };
        return response.status(200).send(successResponse);
    }

    // Vendor Product Detail API
    /**
     * @api {get} /api/admin-vendor-product/vendor-product-detail/:id Vendor Product Detail API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get product Detail",
     *      "data": {
     *       "createdDate": "",
     *       "productId": "",
     *       "sku": "",
     *       "upc": "",
     *       "hsn": "",
     *       "location": "",
     *       "quantity": "",
     *       "minimumQuantity": "",
     *       "subtractStock": "",
     *       "stockStatusId": "",
     *       "quotationAvailable": "",
     *       "image": "",
     *       "imagePath": "",
     *       "manufacturerId": "",
     *       "shipping": "",
     *       "serviceCharges": "{}",
     *       "taxType": "",
     *       "taxValue": "",
     *       "price": "",
     *       "priceUpdateFileLogId": "",
     *       "dateAvailable": "",
     *       "sortOrder": "",
     *       "name": "",
     *       "description": "",
     *       "amount": null,
     *       "keywords": "",
     *       "discount": "",
     *       "deleteFlag": "",
     *       "isFeatured": "",
     *       "todayDeals": "",
     *       "condition": "",
     *       "rating": "",
     *       "wishListStatus": "",
     *       "productSlug": "",
     *       "isActive": "",
     *       "width": "",
     *       "height": "",
     *       "length": "",
     *       "weight": "",
     *       "hasStock": "",
     *       "priceType": "",
     *       "isSimplified": "",
     *       "owner": "",
     *       "isCommon": "",
     *       "skuId": "",
     *       "hasTirePrice": "",
     *       "outOfStockThreshold": "",
     *       "notifyMinQuantity": "",
     *       "minQuantityAllowedCart": "",
     *       "maxQuantityAllowedCart": "",
     *       "enableBackOrders": "",
     *       "pincodeBasedDelivery": "",
     *       "attributeKeyword": "",
     *       "settedAsCommonOn": "",
     *       "productHighlights": [
     *       {
     *           "data": ""
     *       }
     *   ],
     *   "productCost": "",
     *   "packingCost": "",
     *   "shippingCost": "",
     *   "tax": "",
     *   "others": "",
     *   "approvalflag": "",
     *   "vendorId": "",
     *   "vendorName": " ",
     *   "productImage": [
     *       {
     *           "productId": "",
     *           "image": "",
     *           "containerName": "",
     *           "defaultImage": ""
     *       }
     *   ],
     *   "productVideo": {
     *       "id": "",
     *       "productId": "",
     *       "name": "",
     *       "path": "",
     *       "type": "",
     *   },
     *   "Category": [
     *       {
     *           "createdBy": "",
     *           "createdDate": "",
     *           "modifiedBy": "",
     *          "modifiedDate": "",
     *           "categoryId": "",
     *           "name": "",
     *           "image": "",
     *           "imagePath": "",
     *           "parentInt": "",
     *           "sortOrder": "",
     *           "categorySlug": "",
     *           "isActive": "",
     *           "categoryDescription": "",
     *           "levels": ""
     *       }
     *   ],
     *   "productSpecialPrice": [],
     *   "productTirePrices": [],
     *   "productDiscountData": []
     *  }
     * }
     * @apiSampleRequest /api/admin-vendor-product/vendor-product-detail/:id
     * @apiErrorExample {json} productDetail error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/vendor-product-detail/:id')
    @Authorized()
    public async vendorProductDetail(@Param('id') id: number, @Res() response: any): Promise<any> {
        const productDetail: any = await this.productService.findOne({
            productId: id,
        });
        const productDetails: any = instanceToPlain(productDetail);
        const specialCharges = productDetails.serviceCharges;
        if (specialCharges) {
            const specialCharge = JSON.parse(productDetails.serviceCharges);
            productDetails.productCost = specialCharge.productCost;
            productDetails.packingCost = specialCharge.packingCost;
            productDetails.shippingCost = specialCharge.shippingCost;
            productDetails.others = specialCharge.others;
        }
        if (productDetails.taxType === 2) {
            const tax = await this.taxService.findOne({ taxId: productDetails.taxValue });
            let percentToAmount;
            if (tax !== undefined) {
                percentToAmount = productDetails.price * (tax.taxPercentage / 100);
            } else {
                percentToAmount = 0;
            }
            const val = +productDetails.price + percentToAmount;
            productDetails.priceWithTax = val;
        } else {
            const taxValue = (productDetails.taxValue && productDetails.taxValue > 0) ? productDetails.taxValue : 0;
            const val = +productDetails.price + taxValue;
            productDetails.priceWithTax = val;
        }
        const productSku = await this.skuService.findOne({ id: productDetails.skuId });
        productDetails.quantity = productSku ? productSku.quantity : productDetails.quantity;
        const vendorProduct = await this.vendorProductService.findOne({
            // select: ['vendorId', 'productId', 'approvalFlag', 'vendorProductCommission'],
            where: { productId: id },
        });
        const vendor = await this.vendorService.findOne({
            select: ['customerId', 'companyLogo', 'companyLogoPath', 'companyName', 'companyMobileNumber', 'companyEmailId', 'instagram', 'facebook', 'twitter', 'youtube', 'vendorPrefixId'],
            where: { vendorId: vendorProduct.vendorId },
        });
        const customer = await this.customerService.findOne({
            select: ['firstName', 'email', 'mobileNumber', 'avatar', 'avatarPath', 'isActive'],
            where: { id: vendor.customerId },
        });
        productDetails.approvalflag = vendorProduct.approvalFlag;
        productDetails.rejectReason = vendorProduct.rejectReason;
        productDetails.vendorId = vendorProduct.vendorId;
        productDetails.vendorProductCommission = vendorProduct.vendorProductCommission;
        productDetails.companyLogo = vendor.companyLogo;
        productDetails.companyLogoPath = vendor.companyLogoPath;
        productDetails.companyName = vendor.companyName;
        productDetails.companyMobileNumber = vendor.companyMobileNumber;
        productDetails.companyEmailId = vendor.companyEmailId;
        productDetails.vendorPrefixId = vendor.vendorPrefixId;
        productDetails.instagram = vendor.instagram;
        productDetails.facebook = vendor.facebook;
        productDetails.twitter = vendor.twitter;
        productDetails.youtube = vendor.youtube;
        productDetails.vendorName = customer.firstName;
        productDetails.email = customer.email;
        productDetails.mobileNumber = customer.mobileNumber;
        productDetails.avatar = customer.avatar;
        productDetails.avatarPath = customer.avatarPath;
        productDetails.isActive = customer.isActive;
        productDetails.productImage = await this.productImageService.findAll({
            select: ['productId', 'image', 'containerName', 'defaultImage'],
            where: {
                productId: id,
            },
            order: {
                sortOrder: 'ASC',
            },
        });
        productDetails.productVideo = await this.productVideoService.findOne({
            select: ['id', 'name', 'path', 'type', 'productId'],
            where: { productId: productDetail.productId },
        });
        productDetails.Category = await this.productToCategoryService.findAll({
            select: ['categoryId', 'productId'],
            where: { productId: id },
        }).then((val) => {
            const category = val.map(async (value: any) => {
                const categoryValue = await this.categoryService.findOne({ where: { categoryId: value.categoryId } });
                const categoryLevel = await this.categoryPathService.findCategoryLevel(categoryValue.categorySlug);
                categoryValue.levels = categoryLevel.levels;
                const temp: any = categoryValue;
                return temp;
            });
            const results = Promise.all(category);
            return results;
        });
        productDetails.productSpecialPrice = await this.productSpecialService.findAll({
            select: ['productSpecialId', 'priority', 'price', 'dateStart', 'dateEnd', 'skuId'],
            where: { productId: id },
        }).then((val) => {
            const special = val.map(async (value: any) => {
                const skuNames = await this.skuService.findOne({ id: value.skuId });
                const temp: any = value;
                if (skuNames !== undefined) {
                    temp.skuName = skuNames.skuName;
                } else {
                    temp.skuName = '';
                }
                return temp;
            });
            const results = Promise.all(special);
            return results;
        });
        productDetails.productDiscountData = await this.productDiscountService.findAll({
            select: ['productDiscountId', 'quantity', 'priority', 'price', 'dateStart', 'dateEnd', 'skuId'],
            where: { productId: id },
        }).then((val) => {
            const discount = val.map(async (value: any) => {
                const discountSkuNames = await this.skuService.findOne({ id: value.skuId });
                const temp: any = value;
                if (discountSkuNames !== undefined) {
                    temp.skuName = discountSkuNames.skuName;
                } else {
                    temp.skuName = '';
                }
                return temp;
            });
            const results = Promise.all(discount);
            return results;
        });
        // product tire price
        productDetails.productTirePrices = await this.productTirePriceService.findAll({
            select: ['id', 'quantity', 'price', 'skuId'],
            where: { productId: productDetail.productId },
        }).then((val) => {
            const tirePrice = val.map(async (value: any) => {
                const tireSkuNames = await this.skuService.findOne({ id: value.skuId });
                const temp: any = value;
                if (tireSkuNames !== undefined) {
                    temp.skuName = tireSkuNames.skuName;
                } else {
                    temp.skuName = '';
                }
                return temp;
            });
            const results = Promise.all(tirePrice);
            return results;
        });
        const successResponse: any = {
            status: 1,
            message: 'Successfully got product petail',
            data: productDetails,
        };
        return response.status(200).send(successResponse);
    }

    // BulkExportVendorProducts
    /**
     * @api {get} /api/admin-vendor-product/bulk-vendor-product-excel-list Bulk Vendor Product Excel sheet
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully download the All Vendor Product Excel List..!!",
     *      "status": "1",
     *      "data": {},
     * }
     * @apiSampleRequest /api/admin-vendor-product/bulk-vendor-product-excel-list
     * @apiErrorExample {json} Allproduct Excel List error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/bulk-vendor-product-excel-list')
    @Authorized(['admin', 'export-all-market-place-product'])
    public async ExportAllProducts(@QueryParam('status') status: string, @QueryParam('productType') productType: number, @QueryParam('vendorId') vendorId: number, @QueryParam('keyword') keyword: string, @Req() request: any, @Res() response: any): Promise<any> {
        const excel = require('exceljs');
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('All Product Excel');
        const rows = [];
        const select = [
            'VendorProducts.vendorProductId as vendorId',
            'customer.firstName as VendorName',
            'product.productId as productId',
            'product.name as name',
            'product.description as description',
            'product.price as price',
            'product.sku as sku',
            'product.upc as upc',
            'product.quantity as quantity',
            'product.condition as productCondition',
            'product.rating as Rating',
            'product.isActive as isActive',
        ];
        const whereConditions = [];
        const relations = [];
        relations.push({
            tableName: 'VendorProducts.product',
            aliasName: 'product',
        },
            {
                tableName: 'VendorProducts.vendor',
                aliasName: 'vendor',
            },
            {
                tableName: 'vendor.customer',
                aliasName: 'customer',
            });
        if (status) {
            whereConditions.push({
                name: 'product.isActive',
                op: 'and',
                value: status,
            });
        }
        if (+vendorId) {
            whereConditions.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: vendorId,
            });
        }
        const searchConditions = [];
        if (keyword) {
            searchConditions.push({
                name: ['product.keywords', 'product.name', 'customer.first_name'],
                value: keyword.toLowerCase(),
            });
        }
        const sort = [];
        sort.push({
            name: 'VendorProducts.createdDate',
            order: 'DESC',
        });
        const vendorProductLists: any = await this.vendorProductService.listByQueryBuilder(0, 0, select, whereConditions, searchConditions, relations, [], sort, false, true);
        worksheet.columns = [
            { header: 'Vendor Id', key: 'vendorId', size: 16, width: 15 },
            { header: 'Vendor Name', key: 'VendorName', size: 16, width: 15 },
            { header: 'Product Id', key: 'productId', size: 16, width: 15 },
            { header: 'Product Name', key: 'name', size: 16, width: 15 },
            { header: 'Description', key: 'description', size: 16, width: 30 },
            { header: 'Price', key: 'price', size: 16, width: 15 },
            { header: 'SKU', key: 'sku', size: 16, width: 15 },
            { header: 'UPC', key: 'upc', size: 16, width: 15 },
            { header: 'Quantity', key: 'quantity', size: 16, width: 15 },
            { header: 'Condition', key: 'condition', size: 16, width: 15 },
            { header: 'Rating', key: 'Rating', size: 16, width: 15 },
            { header: 'Related Products', key: 'relatedProducts', size: 16, width: 15 },
            { header: 'IsActive', key: 'isActive', size: 16, width: 15 },
        ];
        worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('H1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        for (const products of vendorProductLists) {
            const productDescription = products.description;
            const dataDescription = productDescription.replace(/(&nbsp;|(<([^>]+)>))/ig, '');
            rows.push([products.vendorId,
            products.VendorName,
            products.productId,
            products.name,
            dataDescription.trim(),
            products.price,
            products.sku,
            products.upc,
            products.quantity,
            products.productCondition,
            products.Rating,
            products.isActive]);
        }
        // Add all rows data in sheet
        worksheet.addRows(rows);
        const worksheet1 = workbook.addWorksheet('special price');
        worksheet1.columns = [
            { header: 'product Special Id', key: 'productSpecialId', size: 16, width: 30 },
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'product Name', key: 'productName', size: 16, width: 15 },
            { header: 'priority', key: 'priority', size: 16, width: 15 },
            { header: 'price', key: 'price', size: 16, width: 30 },
            { header: 'start date', key: 'startDate', size: 16, width: 15 },
            { header: 'end date', key: 'endDate', size: 16, width: 15 },
        ];
        worksheet1.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const special = [];
        for (const vendorSpecial of vendorProductLists) {
            const specialPrices = await this.productSpecialService.findAll({ where: { productId: vendorSpecial.productId } });
            for (const specialPrice of specialPrices) {
                const productName = await this.productService.findOne({ where: { productId: specialPrice.productId } });
                special.push([specialPrice.productSpecialId, specialPrice.productId, productName.name, specialPrice.priority, specialPrice.price, specialPrice.dateStart, specialPrice.dateEnd]);
            }
        }
        // Add all rows data in sheet
        worksheet1.addRows(special);
        const worksheet2 = workbook.addWorksheet('discount price');
        worksheet2.columns = [
            { header: 'product dicount Id', key: 'productDiscountId', size: 16, width: 30 },
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'product name', key: 'productName', size: 16, width: 30 },
            { header: 'priority', key: 'priority', size: 16, width: 15 },
            { header: 'price', key: 'price', size: 16, width: 30 },
            { header: 'start date', key: 'startDate', size: 16, width: 15 },
            { header: 'end date', key: 'endDate', size: 16, width: 15 },
        ];
        worksheet2.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const discount = [];
        for (const vendorDiscount of vendorProductLists) {
            const discountPrices = await this.productDiscountService.findAll({ where: { productId: vendorDiscount.productId } });
            for (const discountPrice of discountPrices) {
                const productName = await this.productService.findOne({ where: { productId: discountPrice.productId } });
                discount.push([discountPrice.productDiscountId, discountPrice.productId, productName.name, discountPrice.priority, discountPrice.price, discountPrice.dateStart, discountPrice.dateEnd]);
            }
        }
        // Add all rows data in sheet
        worksheet2.addRows(discount);
        const worksheet3 = workbook.addWorksheet('Images');
        worksheet3.columns = [
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'product Name', key: 'productName', size: 16, width: 15 },
            { header: 'Image Path', key: 'imagePath', size: 16, width: 15 },
            { header: 'Image', key: 'image', size: 16, width: 30 },
            { header: 'Default Image', key: 'defaultImage', size: 16, width: 30 },
        ];
        worksheet3.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const productimage = [];
        for (const venImage of vendorProductLists) {
            const images = await this.productImageService.findAll({
                where: {
                    productId: venImage.productId,
                },
                order: {
                    sortOrder: 'ASC',
                },
            });
            for (const image of images) {
                const productName = await this.productService.findOne({ where: { productId: image.productId } });
                productimage.push([image.productId, productName.name, image.containerName, image.image, image.defaultImage]);
            }
        }
        // Add all rows data in sheet
        worksheet3.addRows(productimage);
        const worksheet4 = workbook.addWorksheet('Related Category');
        worksheet4.columns = [
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'Category Id', key: 'categoryId', size: 16, width: 15 },
            { header: 'Category Name', key: 'CategoryName', size: 16, width: 30 },
        ];
        worksheet4.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet4.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet4.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const relatedCategory = [];
        for (const venCategory of vendorProductLists) {
            const categories = await this.productToCategoryService.findAll({ where: { productId: venCategory.productId } });
            for (const category of categories) {
                const categoryName = await this.categoryService.findOne({ where: { categoryId: category.categoryId } });
                relatedCategory.push([category.productId, category.categoryId, categoryName.name]);
            }
        }
        // Add all rows data in sheet
        worksheet4.addRows(relatedCategory);

        const fileName = './ProductExcel_' + Date.now() + '.xlsx';
        await workbook.xlsx.writeFile(fileName);
        return new Promise((resolve, reject) => {
            response.download(fileName, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    fs.unlinkSync(fileName);
                    return response.end();
                }
            });
        });
    }
    // ExportProductsById
    /**
     * @api {get} /api/admin-vendor-product/vendor-product-excel-list Vendor Product Excel sheet
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} productId productId
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully download the All Vendor Product Excel List..!!",
     *      "status": "1",
     *      "data": {},
     * }
     * @apiSampleRequest /api/admin-vendor-product/vendor-product-excel-list
     * @apiErrorExample {json} Allproduct Excel List error
     * HTTP/1.1 500 Internal Server Error
     */

    @Post('/vendor-product-excel-list')
    @Authorized(['admin', 'export-market-place-product'])
    public async ExportAllProductsById(@BodyParam('productId') productId: number[], @BodyParam('price') price: number, @Req() request: any, @Res() response: any): Promise<any> {
        const excel = require('exceljs');
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('All Product Excel');
        const rows = [];
        // Excel sheet column define
        worksheet.columns = [
            { header: 'Vendor Id', key: 'vendorId', size: 16, width: 15 },
            { header: 'Vendor Name', key: 'VendorName', size: 16, width: 15 },
            { header: 'Product Id', key: 'productId', size: 16, width: 15 },
            { header: 'Product Name', key: 'name', size: 16, width: 15 },
            { header: 'Description', key: 'description', size: 16, width: 30 },
            { header: 'Price', key: 'price', size: 16, width: 15 },
            { header: 'SKU', key: 'sku', size: 16, width: 15 },
            { header: 'UPC', key: 'upc', size: 16, width: 15 },
            { header: 'Quantity', key: 'quantity', size: 16, width: 15 },
            { header: 'Condition', key: 'condition', size: 16, width: 15 },
            { header: 'Rating', key: 'Rating', size: 16, width: 15 },
            { header: 'Related Products', key: 'relatedProducts', size: 16, width: 15 },
            { header: 'IsActive', key: 'isActive', size: 16, width: 15 },
        ];
        worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('H1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('I1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('J1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('K1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('L1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('M1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('N1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('O1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('P1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('Q1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        // const productIds = await this.productService.find({});
        // console.log(productIds[1],'ppppppppppppp');
        // productIds.map((val: any) => {
        // console.log(val,'ppppppppppppp');
        // const getProductId = val.productId;
        // return getProductId;
        // });
        // const productsid: any = productId.split(',');
        // const productid = productId?.length > 0 ? productId : productIds;
        const productData = await this.productService.findAll().then((products) => products.map(product => product.productId));
        // console.log(productData, 'pppppppppppppp');
        const productIds = productId?.length > 0 ? productId : productData;
        for (const id of productIds) {
            const dataId = await this.productService.findOne(id);
            if (dataId === undefined) {
                const errorResponse: any = {
                    status: 0,
                    message: 'Invalid productId',
                };
                return response.status(400).send(errorResponse);
            }
        }
        for (const product of productIds) {
            const data = await this.productService.findOne(product);
            const productDescription = data.description;
            const dataDescription = productDescription?.replace(/(&nbsp;|(<([^>]+)>))/ig, '') ?? '';
            const vendorProduct = await this.vendorProductService.findOne({ select: ['vendorId'], where: { productId: data.productId } });
            let vendors;
            let customer;
            if (vendorProduct) {
                vendors = await this.vendorService.findOne({ select: ['customerId'], where: { vendorId: vendorProduct.vendorId } });
                customer = await this.customerService.findOne({ select: ['firstName'], where: { id: vendors.customerId } });
            }

            rows.push([vendorProduct?.vendorId, customer?.firstName, data.productId, data.name, dataDescription?.trim() ?? '', data.price, data.sku, data.upc, data.quantity, data.isFeatured, data.todaysDeals, data.condition, data.rating, data.isActive]);
        }
        // Add all rows data in sheet
        worksheet.addRows(rows);
        const worksheet1 = workbook.addWorksheet('special price');
        worksheet1.columns = [
            { header: 'product Special Id', key: 'productSpecialId', size: 16, width: 30 },
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'product Name', key: 'productName', size: 16, width: 15 },
            { header: 'priority', key: 'priority', size: 16, width: 15 },
            { header: 'price', key: 'price', size: 16, width: 30 },
            { header: 'start date', key: 'startDate', size: 16, width: 15 },
            { header: 'end date', key: 'endDate', size: 16, width: 15 },
        ];
        worksheet1.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet1.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const special = [];
        // const productid: any = productId.split(',');
        for (const products of productIds) {
            const specialPrices = await this.productSpecialService.findAll({ where: { productId: products } });
            for (const specialPrice of specialPrices) {
                const productName = await this.productService.findOne({ where: { productId: specialPrice.productId } });
                special.push([specialPrice.productSpecialId, specialPrice.productId, productName.name, specialPrice.priority, specialPrice.price, specialPrice.dateStart, specialPrice.dateEnd]);
            }
        }
        // Add all rows data in sheet
        worksheet1.addRows(special);
        const worksheet2 = workbook.addWorksheet('discount price');
        worksheet2.columns = [
            { header: 'product dicount Id', key: 'productDiscountId', size: 16, width: 30 },
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'product name', key: 'productName', size: 16, width: 30 },
            { header: 'priority', key: 'priority', size: 16, width: 15 },
            { header: 'price', key: 'price', size: 16, width: 30 },
            { header: 'start date', key: 'startDate', size: 16, width: 15 },
            { header: 'end date', key: 'endDate', size: 16, width: 15 },
        ];
        worksheet2.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const discount = [];
        const disproductsid: any = productIds;
        for (const products of disproductsid) {
            const discountPrices = await this.productDiscountService.findAll({ where: { productId: products } });
            for (const discountPrice of discountPrices) {
                const productName = await this.productService.findOne({ where: { productId: discountPrice.productId } });
                discount.push([discountPrice.productDiscountId, discountPrice.productId, productName.name, discountPrice.priority, discountPrice.price, discountPrice.dateStart, discountPrice.dateEnd]);
            }
        }
        // Add all rows data in sheet
        worksheet2.addRows(discount);
        const worksheet3 = workbook.addWorksheet('Images');
        worksheet3.columns = [
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'product Name', key: 'productName', size: 16, width: 15 },
            { header: 'Image Path', key: 'imagePath', size: 16, width: 15 },
            { header: 'Image', key: 'image', size: 16, width: 30 },
            { header: 'Default Image', key: 'defaultImage', size: 16, width: 30 },
        ];
        worksheet3.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet3.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const productimage = [];
        const imageProductId: any = productIds;
        for (const products of imageProductId) {
            const images = await this.productImageService.findAll({
                where: { productId: products },
                order: {
                    sortOrder: 'ASC',
                },
            });
            for (const image of images) {
                const productName = await this.productService.findOne({ where: { productId: image.productId } });
                productimage.push([image.productId, productName.name, image.containerName, image.image, image.defaultImage]);
            }
        }
        // Add all rows data in sheet
        worksheet3.addRows(productimage);
        const worksheet6 = workbook.addWorksheet('Related Category');
        worksheet6.columns = [
            { header: 'product Id', key: 'productId', size: 16, width: 15 },
            { header: 'Category Id', key: 'categoryId', size: 16, width: 15 },
            { header: 'Category Name', key: 'CategoryName', size: 16, width: 30 },
        ];
        worksheet6.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet6.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet6.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        const relatedCategory = [];
        const relatedProductId: any = productIds;
        for (const products of relatedProductId) {
            const categories = await this.productToCategoryService.findAll({ where: { productId: products } });
            for (const category of categories) {
                const categoryName = await this.categoryService.findOne({ where: { categoryId: category.categoryId } });
                relatedCategory.push([category.productId, category.categoryId, categoryName.name]);
            }
        }
        // Add all rows data in sheet
        worksheet6.addRows(relatedCategory);

        const fileName = './ProductExcel_' + Date.now() + '.xlsx';
        await workbook.xlsx.writeFile(fileName);
        return new Promise((resolve, reject) => {
            response.download(fileName, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    fs.unlinkSync(fileName);
                    return response.end();
                }
            });
        });
    }
    // Approve vendors product  API
    /**
     * @api {put} /api/admin-vendor-product/approve-product/:id Product Approval API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} approvalFlag approval flag should be 1
     * @apiParamExample {json} Input
     * {
     *      "approvalFlag" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully approved product.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin-vendor-product/approve-product/:id
     * @apiErrorExample {json} product approval error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/approve-product/:id')
    @Authorized(['admin', 'approve-market-place-product'])
    public async productApproval(@Param('id') id: number, @BodyParam('approvalFlag', { required: true }) approvalFlag: number, @BodyParam('reason') reason: string, @Req() request: any, @Res() response: any): Promise<any> {

        const vendorProduct = await this.vendorProductService.findOne({
            where: {
                productId: id,
            },
        });

        if (!vendorProduct) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid product Id',
            };
            return response.status(400).send(errorResponse);
        }

        vendorProduct.approvalFlag = approvalFlag;
        if (reason?.trim()) {
            vendorProduct.rejectReason.push({
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                comment: reason,
            });
        }
        vendorProduct.approvedBy = approvalFlag === 1 ? request.user.userId : undefined;
        const today = new Date().toISOString().slice(0, 10);
        vendorProduct.approvalDate = approvalFlag === 1 ? today : undefined;
        const vendorProductSave = await this.vendorProductService.update(vendorProduct.vendorProductId, vendorProduct);
        const vendor = await this.vendorService.findOne({ select: ['customerId'], where: { vendorId: vendorProductSave.vendorId } });
        const vendorCustomer = await this.customerService.findOne({ select: ['firstName', 'email'], where: { id: vendor.customerId } });

        if (vendorProductSave.approvalFlag === 1) {

            const emailContent = await this.emailTemplateService.findOne(16);
            const setting = await this.settingService.findOne();
            const product = await this.productService.findOne({ select: ['name'], where: { productId: id } });
            const message = emailContent.content.replace('{name}', vendorCustomer.firstName).replace('{siteName}', setting.siteName).replace('{productname}', product.name).replace('{productLink}', env.productRedirectUrl + product.productSlug).replace('{siteUrl}', setting.siteUrl).replace('{siteName}', setting.siteName);
            const redirectUrl = env.vendorRedirectUrl;
            const mailContents: any = {};
            mailContents.logo = setting;
            mailContents.emailContent = message;
            mailContents.redirectUrl = redirectUrl;
            mailContents.productDetailData = '';
            MAILService.sendMail(mailContents, vendorCustomer.email, emailContent.subject.replace('{siteName}', setting.siteName), false, false, '');

            const successResponse: any = {
                status: 1,
                message: 'Successfully Approved this Product and sent an Approval mail to seller',
                data: vendorProductSave,
            };

            return response.status(200).send(successResponse);

        } else if (vendorProductSave.approvalFlag === 2) {

            const product = await this.productService.findOne({ where: { productId: id }, relations: ['productImage'] });
            product.isActive = 0;
            await this.productService.create(product);
            const setting = await this.settingService.findOne();
            const productData: any = {};
            productData.productName = product.name;
            productData.productImageName = product.productImage[0].image;
            productData.productImagePath = product.productImage[0].containerName;
            productData.currencySymbol = setting.currencySymbol ?? '';
            productData.price = product.price ?? '';
            productData.sku = product.sku;

            const emailContent = await this.emailTemplateService.findOne(43);
            const message = emailContent.content.replace('{name}', vendorCustomer.firstName).replace('{XXXXXX}', reason ?? '');
            const redirectUrl = env.vendorRedirectUrl;
            const mailContents: any = {};
            mailContents.logo = setting;
            mailContents.templateName = 'emailTemplates.ejs';
            mailContents.emailContent = message;
            mailContents.redirectUrl = redirectUrl;
            mailContents.productInfo = [productData];

            MAILService.sendMail(mailContents, vendorCustomer.email, emailContent.subject, false, false, '');

            const successResponse: any = {
                status: 1,
                message: 'Successfully Rejected this Product and sent an mail to seller',
                data: vendorProductSave,
            };

            return response.status(200).send(successResponse);
        }
    }

    // Adding Status for vendors product  API
    /**
     * @api {put} /api/admin-vendor-product/add-product-status/:id Add Vendor Product Status API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} status either should be 1 or 0
     * @apiParamExample {json} Input
     * {
     *      "status" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated status.",
     *      "status": "1",
     *      "data": {
     *      "createdBy": "",
     *      "createdDate": "",
     *      "modifiedBy": "",
     *      "modifiedDate": "",
     *      "productId": "",
     *      "sku": "",
     *      "upc": "",
     *      "hsn": "",
     *      "location": "",
     *      "quantity": "",
     *      "minimumQuantity": "",
     *      "subtractStock": "",
     *      "stockStatusId": "",
     *      "quotationAvailable": "",
     *      "image": "",
     *      "imagePath": "",
     *      "manufacturerId": "",
     *      "shipping": "",
     *      "serviceCharges": "{}",
     *      "taxType": "",
     *      "taxValue": "",
     *      "price": "",
     *      "priceUpdateFileLogId": "",
     *      "dateAvailable": "",
     *      "sortOrder": "",
     *      "name": "T",
     *      "description": "",
     *      "amount": null,
     *      "keywords": "",
     *      "discount": "",
     *      "deleteFlag": "",
     *      "isFeatured": "",
     *      "todayDeals": "",
     *      "condition": "",
     *      "rating": "",
     *      "wishListStatus": "",
     *      "productSlug": "",
     *      "isActive": "",
     *      "width": "",
     *      "height": "",
     *      "length": "",
     *      "weight": "",
     *      "hasStock": "",
     *      "priceType": "",
     *      "isSimplified": "",
     *      "owner": "",
     *      "isCommon": "",
     *      "skuId": "",
     *      "hasTirePrice": "",
     *      "outOfStockThreshold": "",
     *      "notifyMinQuantity": "",
     *      "minQuantityAllowedCart": "",
     *      "maxQuantityAllowedCart": "",
     *      "enableBackOrders": "",
     *      "pincodeBasedDelivery": "",
     *      "attributeKeyword": "",
     *      "settedAsCommonOn": "",
     *      "productHighlights": ""
     *   }
     * }
     * @apiSampleRequest /api/admin-vendor-product/add-product-status/:id
     * @apiErrorExample {json} product approval error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/add-product-status/:id')
    @Authorized()
    public async addProductStatus(@Param('id') id: number, @BodyParam('status') status: number, @Req() request: any, @Res() response: any): Promise<any> {

        const product = await this.productService.findOne({
            where: {
                productId: id,
            },
        });
        if (!product) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid product Id',
            };
            return response.status(400).send(errorResponse);
        }

        product.isActive = status;
        const vendorProductSave = await this.productService.create(product);
        if (vendorProductSave) {
            const successResponse: any = {
                status: 1,
                message: 'Successfully Updated Status',
                data: vendorProductSave,
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'Unable to update the product status',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Update bulk Status for vendors product  API
    /**
     * @api {put} /api/admin-vendor-product/bulk-status bulk update Vendor Product Status API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} status either should be 1 or 0
     * @apiParamExample {json} Input
     * {
     *      "statusId" : 1,
     *      "productIds": ""
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated status.",
     *      "status": "1",
     * }
     * }
     * @apiSampleRequest /api/admin-vendor-product/bulk-status
     * @apiErrorExample {json} product approval error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/bulk-status')
    @Authorized('admin')
    public async updateBlukProductStatus(@BodyParam('productIds') productIds: string, @BodyParam('statusId') statusId: number, @Req() request: any, @Res() response: any): Promise<any> {
        const splitProduct = productIds.split(',');
        for (const id of splitProduct) {
            const findProduct = await this.productService.findOne({
                where: {
                    productId: id,
                },
            });
            if (!findProduct) {
                const errorResponse: any = {
                    status: 0,
                    message: 'Invalid product Id',
                };
                return response.status(400).send(errorResponse);
            }
            findProduct.isActive = statusId;
            await this.productService.create(findProduct);
        }
        const successResponse: any = {
            status: 1,
            message: 'Successfully Updated Status',
        };
        return response.status(200).send(successResponse);
    }

    // Update Vendor Product Commission
    /**
     * @api {put} /api/admin-vendor-product Update Vendor Product Commission
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {string} productId Product Id
     * @apiParam (Request body) {number} commission Commission
     * @apiParamExample {json} Input
     * {
     *      "productId" : "",
     *      "commission" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully update product commission.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin-vendor-product
     * @apiErrorExample {json} product error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put()
    @Authorized()
    public async updateCommission(@BodyParam('productId') productId: string, @BodyParam('commission') commission: number, @Req() request: any, @Res() response: any): Promise<any> {
        const product = productId;
        const splitProduct = product.split(',');
        for (const record of splitProduct) {
            const findProduct = await this.vendorProductService.findOne({
                where: {
                    productId: record,
                },
            });
            if (!findProduct) {
                const errorResponse: any = {
                    status: 0,
                    message: 'Invalid product Id',
                };
                return response.status(400).send(errorResponse);
            }
            findProduct.vendorProductCommission = commission;
            await this.vendorProductService.create(findProduct);
        }
        const successResponse: any = {
            status: 1,
            message: 'Successfully Updated the Commission',
        };
        return response.status(200).send(successResponse);
    }

    // Vendor Product Count API
    /**
     * @api {get} /api/admin-vendor-product/vendor-product-count Vendor Product Count API
     * @apiGroup Admin Vendor Product
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get vendor product count",
     *      "data":{
     *      "totalProduct": "",
     *      "activeProduct": "",
     *      "inActiveProduct": "",
     * },
     *      "status": "1"
     * }
     * @apiSampleRequest /api/admin-vendor-product/vendor-product-count
     * @apiErrorExample {json} Admin Vendor Product error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/vendor-product-count')
    @Authorized()
    public async vendorProductCount(@Res() response: any): Promise<any> {
        const vendorProduct: any = {};
        const select = [];
        const relation = [];
        const whereConditions = [
            {
                name: 'reuse',
                // tslint:disable-next-line:no-null-keyword
                value: null,
            },
            {
                name: 'reuseStatus',
                value: 0,
            },
        ];
        const totalVendorProductCount = await this.vendorProductService.list(0, 0, select, relation, whereConditions, '', 1);
        const whereCondition: any = [];
        const relations: any = [];
        relations.push({
            tableName: 'VendorProducts.product',
            aliasName: 'product',
        },

            {
                tableName: 'VendorProducts.vendor',
                aliasName: 'vendor',
            },
            {
                tableName: 'vendor.customer',
                aliasName: 'customer',
            });
        whereCondition.push({
            name: 'product.isActive',
            op: 'and',
            value: 1,
        },
            {
                name: 'VendorProducts.reuse',
                op: 'IS NULL',
                value: '',
            }, {
            name: 'VendorProducts.reuseStatus',
            op: 'and',
            value: 0,
        });
        const vendorActiveProductListCount: any = await this.vendorProductService.listByQueryBuilder(0, 0, [], whereCondition, [], relations, [], [], true, true);
        const activeVendorProductCount = vendorActiveProductListCount;
        const inactiveWhereCondition: any = [];
        inactiveWhereCondition.push({
            name: 'product.isActive',
            op: 'and',
            value: 0,
        }, {
            name: 'VendorProducts.reuse',
            op: 'IS NULL',
            value: '',
        }, {
            name: 'VendorProducts.reuseStatus',
            op: 'and',
            value: 0,
        });
        const vendorInactiveProductListCount: any = await this.vendorProductService.listByQueryBuilder(0, 0, [], inactiveWhereCondition, [], relations, [], [], true, true);
        const inActiveVendorProductCount = vendorInactiveProductListCount;
        vendorProduct.totalProduct = totalVendorProductCount;
        vendorProduct.activeProduct = activeVendorProductCount;
        vendorProduct.inActiveProduct = inActiveVendorProductCount;
        const successResponse: any = {
            status: 1,
            message: 'Successfully got the seller product count',
            data: vendorProduct,
        };
        return response.status(200).send(successResponse);
    }

    public async validate_slug($slug: string, $id: number = 0, $count: number = 0): Promise<string> {
        const slugCount = await this.productService.checkSlug($slug, $id, $count);
        if (slugCount) {
            if (!$count) {
                $count = 1;
            } else {
                $count++;
            }
            return await this.validate_slug($slug, $id, $count);
        } else {
            if ($count > 0) {
                $slug = $slug + $count;
            }
            return $slug;
        }
    }
}
