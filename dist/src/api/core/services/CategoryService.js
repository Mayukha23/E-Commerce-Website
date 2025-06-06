"use strict";
/*
 * spurtcommerce API
 * version 5.2.0
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const Logger_1 = require("../../../decorators/Logger");
const CategoryModel_1 = require("../models/CategoryModel");
const CategoryRepository_1 = require("../repositories/CategoryRepository");
const index_1 = require("typeorm/index");
let CategoryService = class CategoryService {
    constructor(categoryRepository, log) {
        this.categoryRepository = categoryRepository;
        this.log = log;
    }
    // create Category
    create(category) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.log.info('Create a new category => ', category.toString());
            return this.categoryRepository.save(category);
        });
    }
    // findone category
    findOne(category) {
        return this.categoryRepository.findOne(category);
    }
    // delete Category
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.log.info('Delete a user');
            yield this.categoryRepository.delete(id);
            return;
        });
    }
    // categoryList
    list(limit, offset, select = [], search = [], whereConditions = [], relation = [], sortOrder, count) {
        const condition = {};
        if (select && select.length > 0) {
            condition.select = select;
        }
        condition.where = {};
        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item) => {
                condition.where[item.name] = item.value;
            });
        }
        if (relation === null || relation === void 0 ? void 0 : relation.length) {
            condition.relations = [...relation];
        }
        if (search && search.length > 0) {
            search.forEach((table) => {
                const operator = table.op;
                if (operator === 'where' && table.value !== undefined) {
                    condition.where[table.name] = table.value;
                }
                else if (operator === 'like' && table.value !== undefined) {
                    condition.where[table.name] = (0, index_1.Like)('%' + table.value + '%');
                }
            });
        }
        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }
        condition.order = { sortOrder: (sortOrder === 2) ? 'DESC' : 'ASC', createdDate: 'DESC' };
        if (count) {
            return this.categoryRepository.count(condition);
        }
        return this.categoryRepository.find(condition);
    }
    // category List by queryBuilder
    listByQueryBuilder(limit, offset, select = [], whereConditions = [], searchConditions = [], relations = [], groupBy = [], sort = [], count = false, rawQuery = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const query = yield (0, index_1.getConnection)().getRepository(CategoryModel_1.Category).createQueryBuilder('Category');
            // Select
            if (select && select.length > 0) {
                query.select(select);
            }
            // Join
            if (relations && relations.length > 0) {
                relations.forEach((joinTb) => {
                    query.leftJoinAndSelect(joinTb.tableName, joinTb.aliasName);
                });
            }
            // Where
            if (whereConditions && whereConditions.length > 0) {
                whereConditions.forEach((item) => {
                    if (item.op === 'where' && item.sign === undefined) {
                        query.where(item.name + ' = ' + item.value);
                    }
                    else if (item.op === 'and' && item.sign === undefined) {
                        query.andWhere(item.name + ' = ' + item.value);
                    }
                    else if (item.op === 'and' && item.sign !== undefined) {
                        query.andWhere(' \'' + item.name + '\'' + ' ' + item.sign + ' \'' + item.value + '\'');
                    }
                    else if (item.op === 'raw' && item.sign !== undefined) {
                        query.andWhere(item.name + ' ' + item.sign + ' \'' + item.value + '\'');
                    }
                    else if (item.op === 'or' && item.sign === undefined) {
                        query.orWhere(item.name + ' = ' + item.value);
                    }
                    else if (item.op === 'IN' && item.sign === undefined) {
                        query.andWhere(item.name + ' IN (' + item.value + ')');
                    }
                });
            }
            // Keyword Search
            if (searchConditions && searchConditions.length > 0) {
                searchConditions.forEach((table) => {
                    if ((table.name && table.name instanceof Array && table.name.length > 0) && (table.value && table.value instanceof Array && table.value.length > 0)) {
                        const namesArray = table.name;
                        namesArray.forEach((name, index) => {
                            query.andWhere(new index_1.Brackets(qb => {
                                const valuesArray = table.value;
                                valuesArray.forEach((value, subIndex) => {
                                    if (subIndex === 0) {
                                        qb.andWhere('LOWER(' + name + ')' + ' LIKE ' + '\'%' + value + '%\'');
                                        return;
                                    }
                                    qb.orWhere('LOWER(' + name + ')' + ' LIKE ' + '\'%' + value + '%\'');
                                });
                            }));
                        });
                    }
                    else if (table.name && table.name instanceof Array && table.name.length > 0) {
                        query.andWhere(new index_1.Brackets(qb => {
                            const namesArray = table.name;
                            namesArray.forEach((name, index) => {
                                if (index === 0) {
                                    qb.andWhere('LOWER(' + name + ')' + ' LIKE ' + '\'%' + table.value + '%\'');
                                    return;
                                }
                                qb.orWhere('LOWER(' + name + ')' + ' LIKE ' + '\'%' + table.value + '%\'');
                            });
                        }));
                    }
                    else if (table.value && table.value instanceof Array && table.value.length > 0) {
                        query.andWhere(new index_1.Brackets(qb => {
                            const valuesArray = table.value;
                            valuesArray.forEach((value, index) => {
                                if (index === 0) {
                                    qb.andWhere('LOWER(' + table.name + ')' + ' LIKE ' + '\'%' + value + '%\'');
                                    return;
                                }
                                qb.orWhere('LOWER(' + table.name + ')' + ' LIKE ' + '\'%' + value + '%\'');
                            });
                        }));
                    }
                });
            }
            // GroupBy
            if (groupBy && groupBy.length > 0) {
                let i = 0;
                groupBy.forEach((item) => {
                    if (i === 0) {
                        query.groupBy(item.name);
                    }
                    else {
                        query.addGroupBy(item.name);
                    }
                    i++;
                });
            }
            // orderBy
            if (sort && sort.length > 0) {
                sort.forEach((item) => {
                    query.orderBy('' + item.name + '', '' + item.order + '');
                });
            }
            // Limit & Offset
            if (limit && limit > 0) {
                query.take(limit);
                query.skip(offset);
            }
            if (!count) {
                if (rawQuery) {
                    return query.getRawMany();
                }
                return query.getMany();
            }
            else {
                return query.getCount();
            }
        });
    }
    // find category
    find(category) {
        return this.categoryRepository.find(category);
    }
    slugData(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.categorySlug(data);
        });
    }
    findAll() {
        this.log.info('Find all setting');
        return this.categoryRepository.find();
    }
    slug(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.categorySlugData(data);
        });
    }
    categoryCount(limit, offset, keyword, sortOrder, status) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.categoryCount(limit, offset, keyword, sortOrder, status);
        });
    }
    checkSlug(slug, id, count = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (count > 0) {
                slug = slug + count;
            }
            return yield this.categoryRepository.checkSlugData(slug, id);
        });
    }
    findCategory(categoryName, parentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.findCategory(categoryName, parentId);
        });
    }
    bulkFamilyUpdate(ids, familyId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.updateFamily(ids, familyId);
        });
    }
};
CategoryService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(0, (0, typeorm_typedi_extensions_1.OrmRepository)()),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [CategoryRepository_1.CategoryRepository, Object])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=CategoryService.js.map