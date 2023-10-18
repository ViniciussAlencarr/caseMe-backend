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
var import_crypto_js = __toESM(require("crypto-js"));
var import_express2 = require("express");
var import_cors = __toESM(require("cors"));

// src/utils/getDateTIme.ts
var padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};
var formatDate = (date2) => {
  return [
    date2.getFullYear(),
    padTo2Digits(date2.getMonth() + 1),
    padTo2Digits(date2.getDate())
  ].join("-") + " " + [
    padTo2Digits(date2.getHours()),
    padTo2Digits(date2.getMinutes()),
    padTo2Digits(date2.getSeconds())
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

// src/database/tables/tableNames.ts
var tableNames = {
  supplier: "Fornecedor",
  subCategories: "SubcategoriaFornecedor",
  supplierSubCategory: "FornecedorSubcategoriaFornecedor",
  assessment: "Avaliacoes"
};

// src/database/tables/supplier.ts
var getSuppliers = () => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`SELECT DISTINCT 
        t1.id,
        t1.empresa,
        t1.Categorias,
        t1.estado,
        t1.cidade,
        t1.numTagsRef,
        t3.nome FROM ${tableNames.supplier} as t1 RIGHT JOIN ${tableNames.supplierSubCategory} as t2
        ON t1.id = t2.fornecedor_id RIGHT JOIN ${tableNames.subCategories} as t3 ON t3.id = t2.subcategoriafornecedor_id;`);
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
        estado ELSE NULL END AS result FROM ${tableNames.supplier}
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
        FROM ${tableNames.supplier} as t1;`);
    const [subCategories] = yield db.query(`SELECT nome,
        CASE WHEN nome LIKE '%${company}%' THEN
        nome ELSE NULL END AS result
        FROM ${tableNames.subCategories};`);
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
                subCategorySupplier.nome FROM ${tableNames.supplier} as t1, ${tableNames.subCategories} as subCategorySupplier
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
                subCategorySupplier.nome FROM ${tableNames.supplier} as t1, ${tableNames.subCategories} as subCategorySupplier
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
        SELECT * FROM ${tableNames.supplier}
        WHERE cidade LIKE ?;`, [`%${city}%`]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplierByState = (state) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableNames.supplier}
        WHERE estado LIKE ?;`, [`%${state}%`]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getSupplier = (id) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableNames.supplier}
        WHERE id = ?;`, [id]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getAllSubCategories = () => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`SELECT * FROM ${tableNames.subCategories};`);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var getAllSubCategoriesBySupplier = (fornecedorId) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableNames.supplierSubCategory}
        WHERE fornecedor_id = ?;`, [fornecedorId]);
    if (Object.keys(rows).length != 0) {
      const response = yield db.query(`
            SELECT * FROM ${tableNames.subCategories}
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
        INSERT INTO ${tableNames.supplier} (
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

// src/database/tables/assessment.ts
var getAssessmentById = (id) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableNames.assessment}
        WHERE id = ?;`, [id]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var createAssessment = (data) => __async(void 0, null, function* () {
  try {
    const [suppliers] = yield db.query(`SELECT id FROM ${tableNames.supplier} WHERE id = ?;`, [data.id]);
    if (suppliers.length == 0)
      throw new Error(`O Fornecedor n\xE3o existe para o id '${data.id}'`);
    yield db.query(`
        INSERT INTO ${tableNames.assessment} (
            id,
            avaliacao,
            nomeAvaliador,
            dataAvaliacao,
            texto,
            visivel)
        VALUES (?,?,?,?,?,?)
        `, [
      data.id,
      data.avaliacao,
      data.nomeAvaliador,
      data.dataAvaliacao,
      data.texto,
      data.visivel
    ]);
    return getAssessmentById(data.id);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
var getAllAssessments = () => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        SELECT * FROM ${tableNames.assessment};`);
    return rows;
  } catch (err) {
    console.log(err);
  }
});
var deleteAssessment = (id) => __async(void 0, null, function* () {
  try {
    const [rows] = yield db.query(`
        DELETE FROM ${tableNames.assessment} WHERE id = ?;`, [id]);
    return rows;
  } catch (err) {
    console.log(err);
  }
});

// src/server.ts
var date = /* @__PURE__ */ new Date();
var app = (0, import_express.default)();
var route = (0, import_express2.Router)();
app.use(import_express.default.json());
app.use((0, import_cors.default)());
route.get("/suppliers", (req, res) => __async(exports, null, function* () {
  const suppliers = yield getSuppliers();
  return res.status(200).send(suppliers);
}));
route.get("/supplier/:id/", (req, res) => __async(exports, null, function* () {
  const id = req.params.id;
  const supplier = yield getSupplier(id);
  return res.status(200).send(supplier);
}));
route.get("/supplier-by-city/:city", (req, res) => __async(exports, null, function* () {
  const city = req.params.city;
  const supplier = yield getSupplierByCity(city);
  return res.status(200).send(supplier);
}));
route.get("/supplier-by-neighborhood-city-state/:conditionValue", (req, res) => __async(exports, null, function* () {
  const conditionValue = req.params.conditionValue;
  const supplier = yield getSupplierByNeighborhoodCityState(conditionValue);
  return res.status(200).send(supplier);
}));
route.get("/supplier-by-company-category-sub_category/:company/:category/:sub_category", (req, res) => __async(exports, null, function* () {
  const company = req.params.company;
  const category = req.params.category;
  const subCategory = req.params.sub_category;
  const supplier = yield getSupplierByCompanyCategorySubCategory(company, category, subCategory);
  return res.status(200).send(supplier);
}));
route.get("/search-results/:place/:category", (req, res) => __async(exports, null, function* () {
  const caseMeMention = req.query.caseMeMention;
  const place = req.params.place;
  const category = req.params.category;
  const supplier = yield searchSupplierByResults(place, category, caseMeMention);
  return res.status(200).send(supplier);
}));
route.get("/supplier-by-state/:state", (req, res) => __async(exports, null, function* () {
  const state = req.params.state;
  const supplier = yield getSupplierByState(state);
  return res.status(200).send(supplier);
}));
route.get("/sub-categories", (req, res) => __async(exports, null, function* () {
  const subCategories = yield getAllSubCategories();
  return res.status(200).send(subCategories);
}));
route.get("/supplier/get-all-subcategories/:id", (req, res) => __async(exports, null, function* () {
  const id = req.params.id;
  const supplier = yield getAllSubCategoriesBySupplier(id);
  return res.status(200).send(supplier);
}));
route.post("/supplier/create", (req, res) => __async(exports, null, function* () {
  const data = req.body;
  const params = __spreadProps(__spreadValues({}, data), {
    criado: formatDate(date),
    modificado: formatDate(date)
  });
  const supplier = yield createSupplier(params);
  return res.status(201).send(supplier);
}));
route.get("/assessments", (req, res) => __async(exports, null, function* () {
  const assessments = yield getAllAssessments();
  return res.status(200).send(assessments);
}));
route.post("/assessment/create", (req, res) => __async(exports, null, function* () {
  try {
    const data = req.body;
    const params = __spreadProps(__spreadValues({}, data), {
      dataAvaliacao: formatDate(date)
    });
    const assessment = yield createAssessment(params);
    return res.status(201).send(assessment);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message });
  }
}));
route.delete("/assessment/:id", (req, res) => __async(exports, null, function* () {
  const id = req.params.id;
  const assessment = yield deleteAssessment(id);
  return res.status(201).send(assessment);
}));
route.post("/encode-assessment-url", (req, res) => __async(exports, null, function* () {
  try {
    const { url } = req.body;
    const [baseUrl, decodeRoutes] = url.split("avaliacao");
    const ciphertext = import_crypto_js.default.AES.encrypt(decodeRoutes, "secret key 123").toString();
    return res.status(201).send({
      url: `${baseUrl}avaliacao${ciphertext}`
    });
  } catch (err) {
    return res.status(502).send({ message: err.message });
  }
}));
route.post("/decode-assessment-url", (req, res) => __async(exports, null, function* () {
  try {
    const { url } = req.body;
    const [baseUrl, encodeRoutes] = url.split("avaliacao");
    const bytes = import_crypto_js.default.AES.decrypt(encodeRoutes, "secret key 123");
    const originalText = bytes.toString(import_crypto_js.default.enc.Utf8);
    const supplierId = originalText.split("/")[1];
    const supplierName = originalText.split("/")[2];
    const assessment = yield createAssessment({
      id: supplierId,
      avaliacao: null,
      nomeAvaliador: supplierName,
      dataAvaliacao: formatDate(date),
      texto: null,
      visivel: true
    });
    return res.status(201).send(assessment);
  } catch (err) {
    return res.status(502).send({ message: err.message });
  }
}));
app.use(route);
app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => "server running on port 3333");
