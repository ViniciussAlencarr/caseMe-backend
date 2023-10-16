"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/database/tables/supplier.ts
var supplier_exports = {};
__export(supplier_exports, {
  createSupplier: () => createSupplier,
  getAllSubCategories: () => getAllSubCategories,
  getAllSubCategoriesBySupplier: () => getAllSubCategoriesBySupplier,
  getSupplier: () => getSupplier,
  getSupplierByCity: () => getSupplierByCity,
  getSupplierByCompanyCategorySubCategory: () => getSupplierByCompanyCategorySubCategory,
  getSupplierByNeighborhoodCityState: () => getSupplierByNeighborhoodCityState,
  getSupplierByState: () => getSupplierByState,
  getSuppliers: () => getSuppliers,
  searchSupplierByResults: () => searchSupplierByResults
});
module.exports = __toCommonJS(supplier_exports);

// src/database/service.ts
var import_mysql2 = __toESM(require("mysql2"));

// src/database/config.ts
require("dotenv").config();
var config_default = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// src/database/service.ts
var db = import_mysql2.default.createConnection(config_default).promise();

// src/database/tables/supplier.ts
var tableName = "Fornecedor";
var secondTableName = "SubcategoriaFornecedor";
var thirdTableName = "FornecedorSubcategoriaFornecedor";
var getSuppliers = () => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`SELECT DISTINCT 
        t1.empresa,
        t1.Categorias,
        t1.estado,
        t1.cidade,
        t1.numTagsRef,
        t3.nome FROM ${tableName} as t1 RIGHT JOIN ${thirdTableName} as t2
        ON t1.id = t2.fornecedor_id RIGHT JOIN ${secondTableName} as t3 ON t3.id = t2.subcategoriafornecedor_id;`);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplierByNeighborhoodCityState = (value) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT DISTINCT bairro, cidade, estado,
        CASE WHEN bairro LIKE '%${value}%' THEN
        bairro WHEN cidade LIKE '%${value}%' THEN
        cidade WHEN estado LIKE '%${value}%'THEN
        estado ELSE NULL END AS result FROM ${tableName}
        `);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplierByCompanyCategorySubCategory = (company, category, subCategory) => __async(void 0, null, function* () {
  try {
    const [suppliers] = yield db.query(`SELECT t1.empresa, t1.Categorias,
        CASE WHEN t1.empresa LIKE '%${company}%' THEN
        t1.empresa WHEN t1.Categorias LIKE '%${company}%' THEN t1.Categorias ELSE NULL END AS result
        FROM ${tableName} as t1;`);
    const [subCategories] = yield db.query(`SELECT nome,
        CASE WHEN nome LIKE '%${company}%' THEN
        nome ELSE NULL END AS result
        FROM ${secondTableName};`);
    return Object.assign(suppliers, subCategories);
  } catch (err) {
    console.log(err);
  }
});
var searchSupplierByResults = (place, category, caseMeMention) => __async(void 0, null, function* () {
  try {
    if (caseMeMention == "true") {
      const [supplierResponse] = yield db.query(
        `
                SELECT 
                t1.empresa,
                t1.Categorias,
                t1.estado,
                t1.cidade,
                t1.numTagsRef,
                subCategorySupplier.nome FROM ${tableName} as t1, ${secondTableName} as subCategorySupplier
                WHERE numTagsRef > 0 AND
                (t1.bairro LIKE ?
                OR (t1.cidade LIKE ? 
                OR (t1.estado LIKE ?))) AND (t1.empresa LIKE ? OR (t1.Categorias LIKE ? OR (subCategorySupplier.nome LIKE ?)));`,
        [`%${place}%`, `%${place}%`, `%${place}%`, `%${category}%`, `%${category}%`, `%${category}%`]
      );
      return supplierResponse;
    } else {
      const [supplierResponse] = yield db.query(
        `
                SELECT
                t1.empresa,
                t1.Categorias,
                t1.estado,
                t1.cidade,
                t1.numTagsRef,
                subCategorySupplier.nome FROM ${tableName} as t1, ${secondTableName} as subCategorySupplier
                WHERE (t1.bairro LIKE ?
                OR (t1.cidade LIKE ? 
                OR (t1.estado LIKE ?))) AND (t1.empresa LIKE ? OR (t1.Categorias LIKE ? OR (subCategorySupplier.nome LIKE ?)));`,
        [`%${place}%`, `%${place}%`, `%${place}%`, `%${category}%`, `%${category}%`, `%${category}%`]
      );
      return supplierResponse;
    }
  } catch (err) {
    console.log(err);
  }
});
var getSupplierByCity = (city) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableName}
        WHERE cidade LIKE ?;`, [`%${city}%`]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplierByState = (state) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableName}
        WHERE estado LIKE ?;`, [`%${state}%`]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplier = (id) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableName}
        WHERE id = ?;`, [id]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getAllSubCategories = () => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`SELECT * FROM ${secondTableName};`);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getAllSubCategoriesBySupplier = (fornecedorId) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${thirdTableName}
        WHERE fornecedor_id = ?;`, [fornecedorId]);
    if (Object.keys(rows).length != 0) {
      const response = yield db.query(`
            SELECT * FROM ${secondTableName}
            WHERE id = ?;`, [rows[0].subcategoriafornecedor_id]);
      return response[0];
    }
    return [];
  } catch (err) {
    console.log(err);
  }
});
var createSupplier = (data) => __async(void 0, null, function* () {
  try {
    const [result] = yield db.query(`
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
    return getSupplier(id);
  } catch (err) {
    console.log(err);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSupplier,
  getAllSubCategories,
  getAllSubCategoriesBySupplier,
  getSupplier,
  getSupplierByCity,
  getSupplierByCompanyCategorySubCategory,
  getSupplierByNeighborhoodCityState,
  getSupplierByState,
  getSuppliers,
  searchSupplierByResults
});
