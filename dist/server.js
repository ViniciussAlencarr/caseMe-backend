"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/server.ts
var import_express = __toESM(require("express"));
var import_express2 = require("express");
var import_cors = __toESM(require("cors"));

// src/utils/getDateTIme.ts
var padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};
var formatDate = (date) => {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate())
  ].join("-") + " " + [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds())
  ].join(":");
};

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
    const [rows] = yield db.query(`SELECT * FROM ${tableName};`);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplierByNeighborhoodCityState = (neighborhood, city, state) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT bairro, cidade, estado FROM ${tableName}
        WHERE (bairro LIKE ? OR (cidade LIKE ? OR (estado LIKE ?)));`, [`%${neighborhood}%`, `%${city}%`, `%${state}%`]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplierByCompanyCategorySubCategory = (company, category, subCategory) => __async(void 0, null, function* () {
  try {
    const [supplierResponse] = yield db.query(`SELECT DISTINCT empresa, Categorias
            FROM ${tableName} WHERE 
            (empresa LIKE ? OR (Categorias LIKE ?));`, [`%${company}%`, `%${category}%`]);
    const [subCategoryResponse] = yield db.query(`SELECT nome FROM ${secondTableName} WHERE 
            nome LIKE ?;`, [`%${subCategory}%`]);
    return Object.assign(supplierResponse, subCategoryResponse);
  } catch (err) {
    console.log(err);
  }
});
var searchSupplierByResults = (place, category, caseMeMention) => __async(void 0, null, function* () {
  try {
    if (caseMeMention == "true") {
      const [supplierResponse] = yield db.query(
        `
                SELECT * FROM ${tableName} as t1, ${secondTableName} as subCategorySupplier
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
                SELECT * FROM ${tableName} as t1, ${secondTableName} as subCategorySupplier
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

// src/server.ts
var app = (0, import_express.default)();
var route = (0, import_express2.Router)();
app.use(import_express.default.json());
app.use((0, import_cors.default)());
route.get("/suppliers", (req, res) => __async(exports, null, function* () {
  const suppliers = yield getSuppliers();
  res.status(200).send(suppliers);
}));
route.get("/supplier/:id/", (req, res) => __async(exports, null, function* () {
  const id = req.params.id;
  const supplier = yield getSupplier(id);
  res.status(200).send(supplier);
}));
route.get("/supplier-by-city/:city", (req, res) => __async(exports, null, function* () {
  const city = req.params.city;
  const supplier = yield getSupplierByCity(city);
  res.status(200).send(supplier);
}));
route.get("/supplier-by-neighborhood-city-state/:neighborhood/:city/:state", (req, res) => __async(exports, null, function* () {
  const neighborhood = req.params.neighborhood;
  const city = req.params.city;
  const state = req.params.state;
  const supplier = yield getSupplierByNeighborhoodCityState(neighborhood, city, state);
  res.status(200).send(supplier);
}));
route.get("/supplier-by-company-category-sub_category/:company/:category/:sub_category", (req, res) => __async(exports, null, function* () {
  const company = req.params.company;
  const category = req.params.category;
  const subCategory = req.params.sub_category;
  const supplier = yield getSupplierByCompanyCategorySubCategory(company, category, subCategory);
  res.status(200).send(supplier);
}));
route.get("/search-results/:place/:category", (req, res) => __async(exports, null, function* () {
  const caseMeMention = req.query.caseMeMention;
  const place = req.params.place;
  const category = req.params.category;
  const supplier = yield searchSupplierByResults(place, category, caseMeMention);
  res.status(200).send(supplier);
}));
route.get("/supplier-by-state/:state", (req, res) => __async(exports, null, function* () {
  const state = req.params.state;
  const supplier = yield getSupplierByState(state);
  res.status(200).send(supplier);
}));
route.get("/sub-categories", (req, res) => __async(exports, null, function* () {
  const subCategories = yield getAllSubCategories();
  res.status(200).send(subCategories);
}));
route.get("/supplier/get-all-subcategories/:id", (req, res) => __async(exports, null, function* () {
  const id = req.params.id;
  const supplier = yield getAllSubCategoriesBySupplier(id);
  res.status(200).send(supplier);
}));
route.post("/supplier/create", (req, res) => __async(exports, null, function* () {
  const date = /* @__PURE__ */ new Date();
  const data = req.body;
  const params = __spreadProps(__spreadValues({}, data), {
    criado: formatDate(date),
    modificado: formatDate(date)
  });
  const supplier = yield createSupplier(params);
  res.status(200).send(supplier);
}));
app.use(route);
app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => "server running on port 3333");
