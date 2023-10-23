"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubCategory = exports.getAllSubCategoriesBySupplier = exports.getSubCategoryById = exports.getAllSubCategories = void 0;
const service_1 = require("../service");
const tableNames_1 = require("./tableNames");
const getAllSubCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`SELECT * FROM ${tableNames_1.tableNames.subCategories};`);
        return rows;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAllSubCategories = getAllSubCategories;
const getSubCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`
        SELECT * FROM ${tableNames_1.tableNames.subCategories}
        WHERE id = ?;`, [id]);
        return rows;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getSubCategoryById = getSubCategoryById;
const getAllSubCategoriesBySupplier = (fornecedorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`
            SELECT t2.* FROM 
                ${tableNames_1.tableNames.supplierSubCategory} as t1
            
            RIGHT JOIN
                ${tableNames_1.tableNames.subCategories} as t2
            ON t2.id = t1.subcategoriafornecedor_id  WHERE t1.fornecedor_id = ?

        `, [fornecedorId]);
        return rows;
        /* const [rows]: any = await db.query(`
        SELECT * FROM ${tableNames.supplierSubCategory}
        WHERE fornecedor_id = ?;`, [fornecedorId])
        if (Object.keys(rows).length != 0) {
            const response = await db.query(`
            SELECT * FROM ${tableNames.subCategories}
            WHERE id = ?;`, [rows[0].subcategoriafornecedor_id])
            return response[0]
        }
        return [] */
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAllSubCategoriesBySupplier = getAllSubCategoriesBySupplier;
const createSubCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield service_1.db.query(`
        INSERT INTO ${tableNames_1.tableNames.subCategories} (
            categoria_id,
            nome,
            criado,
            modificado,
            visivel,
            slug
        ) VALUES (?,?,?,?,?,?)
        `, [
            data.categoria_id,
            data.nome,
            data.criado,
            data.modificado,
            data.visivel,
            data.slug,
        ]);
        let id = result.insertId;
        return (0, exports.getSubCategoryById)(id);
    }
    catch (err) {
        console.log(err);
    }
});
exports.createSubCategory = createSubCategory;
