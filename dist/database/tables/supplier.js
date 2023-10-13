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
exports.createSupplier = exports.getAllSubCategories = exports.getSupplier = exports.getSupplierByState = exports.getSupplierByCity = exports.searchSupplierByResults = exports.getSupplierByCompanyCategorySubCategory = exports.getSupplierByNeighborhoodCityState = exports.getSuppliers = void 0;
const service_1 = require("../service");
const tableName = 'Fornecedor';
const secondTableName = 'SubcategoriaFornecedor';
const thirdTableName = 'FornecedorSubcategoriaFornecedor';
const getSuppliers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`SELECT * FROM ${tableName};`);
        return rows;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getSuppliers = getSuppliers;
const getSupplierByNeighborhoodCityState = (neighborhood, city, state) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`
        SELECT bairro, cidade, estado FROM ${tableName}
        WHERE bairro LIKE ? OR cidade LIKE ? OR estado LIKE ?;`, [`${neighborhood}%`, `${city}%`, `${state}%`]);
        return rows;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getSupplierByNeighborhoodCityState = getSupplierByNeighborhoodCityState;
const getSupplierByCompanyCategorySubCategory = (company, category, subCategory) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplierResponse = yield service_1.db.query(`SELECT supplier.empresa, supplier.Categorias
            FROM ${tableName} as supplier WHERE 
            supplier.empresa LIKE ? OR supplier.Categorias LIKE ?;`, [`${company}%`, `${category}%`, `${subCategory}%`]);
        const subCategoryResponse = yield service_1.db.query(`SELECT subCategorySupplier.nome
            FROM ${secondTableName} as subCategorySupplier WHERE 
            subCategorySupplier.nome LIKE ?;`, [`${subCategory}%`]);
        return Object.assign(supplierResponse[0], subCategoryResponse[0]);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getSupplierByCompanyCategorySubCategory = getSupplierByCompanyCategorySubCategory;
const searchSupplierByResults = (place, category, caseMeMention) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (caseMeMention == 'true') {
            const supplierResponse = yield service_1.db.query(`
                SELECT * FROM ${tableName}
                WHERE numTagsRef > 0 AND
                (bairro LIKE ?
                OR cidade LIKE ? 
                OR estado LIKE ?) AND
                Categorias LIKE ?;`, [`${place}%`, `${place}%`, `${place}%`, `${category}%`]);
            const subCategoryResponse = yield service_1.db.query(`SELECT subCategorySupplier.nome
                FROM ${secondTableName} as subCategorySupplier WHERE 
                subCategorySupplier.nome LIKE ?;`, [`${category}%`]);
            return Object.assign(supplierResponse[0], subCategoryResponse[0]);
        }
        else {
            const supplierResponse = yield service_1.db.query(`
                SELECT * FROM ${tableName}
                WHERE (bairro LIKE ?
                OR cidade LIKE ? 
                OR estado LIKE ?) AND
                Categorias LIKE ?;`, [`${place}%`, `${place}%`, `${place}%`, `${category}%`]);
            const subCategoryResponse = yield service_1.db.query(`SELECT subCategorySupplier.nome
                FROM ${secondTableName} as subCategorySupplier WHERE 
                subCategorySupplier.nome LIKE ?;`, [`${category}%`]);
            return Object.assign(supplierResponse[0], subCategoryResponse[0]);
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.searchSupplierByResults = searchSupplierByResults;
const getSupplierByCity = (city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`
        SELECT * FROM ${tableName}
        WHERE cidade LIKE ?;`, [`${city}%`]);
        return rows;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getSupplierByCity = getSupplierByCity;
const getSupplierByState = (state) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`
        SELECT * FROM ${tableName}
        WHERE estado LIKE ?;`, [`${state}%`]);
        return rows;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getSupplierByState = getSupplierByState;
const getSupplier = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`
        SELECT * FROM ${tableName}
        WHERE id = ?;`, [id]);
        return rows;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getSupplier = getSupplier;
const getAllSubCategories = (fornecedorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield service_1.db.query(`
        SELECT * FROM ${thirdTableName}
        WHERE fornecedor_id = ?;`, [fornecedorId]);
        if (Object.keys(rows).length != 0) {
            const response = yield service_1.db.query(`
            SELECT * FROM ${secondTableName}
            WHERE id = ?;`, [rows[0].subcategoriafornecedor_id]);
            return response[0];
        }
        return [];
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAllSubCategories = getAllSubCategories;
const createSupplier = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield service_1.db.query(`
        INSERT INTO ${tableName} (
            empresa,
            website,
            contatoTelefone,
            cnpj,
            user_id,
            criado,
            modificado,
            imagem,
            descricao,
            contatoEmail,
            cep,
            logradouro,
            bairro,
            cidade,
            estado,
            numero,
            visivel,
            slug,
            contatoNome2,
            contatoEmail2,
            contatoTelefone2,
            contatoTelefoneA2,
            contatoNome3,
            contatoEmail3,
            contatoTelefone3,
            contatoTelefoneA3,
            metadescricao,
            origemCadastro,
            Categorias,
            facebook,
            instagram,
            twitter,
            pinterest,
            youtube,
            vimeo,
            numTagsRef)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
            data.empresa,
            data.website,
            data.contatoTelefone,
            data.cnpj,
            data.user_id,
            data.criado,
            data.modificado,
            data.imagem,
            data.descricao,
            data.contatoEmail,
            data.cep,
            data.logradouro,
            data.bairro,
            data.cidade,
            data.estado,
            data.numero,
            data.visivel,
            data.slug,
            data.contatoNome2,
            data.contatoEmail2,
            data.contatoTelefone2,
            data.contatoTelefoneA2,
            data.contatoNome3,
            data.contatoEmail3,
            data.contatoTelefone3,
            data.contatoTelefoneA3,
            data.metadescricao,
            data.origemCadastro,
            data.Categorias,
            data.facebook,
            data.instagram,
            data.twitter,
            data.pinterest,
            data.youtube,
            data.vimeo,
            data.numTagsRef
        ]);
        let id = result.insertId;
        return (0, exports.getSupplier)(id);
    }
    catch (err) {
        console.log(err);
    }
});
exports.createSupplier = createSupplier;
