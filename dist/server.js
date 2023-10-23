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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const express_2 = require("express");
const cors_1 = __importDefault(require("cors"));
const getDateTIme_1 = require("./utils/getDateTIme");
/* TODO: alterar para trazer SOMENTE os campos, não filtrar por eles. Ex: trazer o bairro, cidade e estado enquanto digita */
const supplier_1 = require("./database/tables/supplier");
const supplierSubCategory_1 = require("./database/tables/supplierSubCategory");
const assessment_1 = require("./database/tables/assessment");
const date = new Date();
const app = (0, express_1.default)();
const route = (0, express_2.Router)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Fornecedor
// get all
route.get('/suppliers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let params = Object.keys(req.query).length != 0 ? req.query : {
        page: '0',
        perPage: '15'
    };
    const suppliers = yield (0, supplier_1.getSuppliers)(params);
    return res.status(200).send(suppliers);
}));
// get one
route.get('/supplier/:id/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const supplier = yield (0, supplier_1.getSupplier)(id);
    return res.status(200).send(supplier);
}));
// search by city 
route.get('/supplier-by-city/:city', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = req.params.city;
    const supplier = yield (0, supplier_1.getSupplierByCity)(city);
    return res.status(200).send(supplier);
}));
// search by neighborhood, city or state
route.get('/supplier-by-neighborhood-city-state/:conditionValue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conditionValue = req.params.conditionValue;
    const supplier = yield (0, supplier_1.getSupplierByNeighborhoodCityState)(conditionValue);
    return res.status(200).send(supplier);
}));
// search by neighborhood, city or state
route.get('/supplier-by-company-category-sub_category/:company/:category/:sub_category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = req.params.company;
    const category = req.params.category;
    const subCategory = req.params.sub_category;
    const supplier = yield (0, supplier_1.getSupplierByCompanyCategorySubCategory)(company, category, subCategory);
    return res.status(200).send(supplier);
}));
// search results
route.get('/search-results/:researches', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const caseMeMention = req.query.caseMeMention;
    const researches = req.params.researches;
    const suppliers = yield (0, supplier_1.searchSupplierByResults)(researches, caseMeMention);
    return res.status(200).send(suppliers);
}));
// search by state
route.get('/supplier-by-state/:state', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const state = req.params.state;
    const supplier = yield (0, supplier_1.getSupplierByState)(state);
    return res.status(200).send(supplier);
}));
// get all subcategories
route.get('/sub-categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategories = yield (0, supplierSubCategory_1.getAllSubCategories)();
    return res.status(200).send(subCategories);
}));
// get all subcategories by supplier
route.get('/supplier/get-all-subcategories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const supplier = yield (0, supplierSubCategory_1.getAllSubCategoriesBySupplier)(id);
    return res.status(200).send(supplier);
}));
route.post('/sub-category/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const params = Object.assign(Object.assign({}, data), { criado: (0, getDateTIme_1.formatDate)(date), modificado: (0, getDateTIme_1.formatDate)(date) });
    const subCategory = yield (0, supplierSubCategory_1.createSubCategory)(params);
    return res.status(200).send(subCategory);
}));
// create
route.post('/supplier/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const params = Object.assign(Object.assign({}, data), { criado: (0, getDateTIme_1.formatDate)(date), modificado: (0, getDateTIme_1.formatDate)(date) });
    const supplier = yield (0, supplier_1.createSupplier)(params);
    return res.status(201).send(supplier);
}));
route.get('/teste', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const suppliers = yield (0, supplier_1.teste)();
    return res.status(200).send(suppliers);
}));
// assessments
route.get('/assessments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const assessments = yield (0, assessment_1.getAllAssessments)();
    return res.status(200).send(assessments);
}));
route.get('/assessment-average', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const assessments = yield (0, supplier_1.getAverageOfAssessments)();
    return res.status(200).send(assessments);
}));
route.post('/assessment/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const params = Object.assign(Object.assign({}, data), { dataAvaliacao: (0, getDateTIme_1.formatDate)(date) });
        const assessment = yield (0, assessment_1.createAssessment)(params);
        return res.status(201).send(assessment);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ message: err.message });
    }
}));
route.delete('/assessment/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const assessment = yield (0, assessment_1.deleteAssessment)(id);
    return res.status(201).send(assessment);
}));
// decode assessment
route.post('/encode-assessment-url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.body;
        const [baseUrl, decodeRoutes] = url.split('avaliacao');
        const ciphertext = crypto_js_1.default.AES.encrypt(decodeRoutes.substring(1), 'secret key 123').toString();
        return res.status(201).send({
            url: `${baseUrl}avaliacao?${ciphertext}`
        });
    }
    catch (err) {
        return res.status(400).send({ message: err.message });
    }
}));
// decode assessment
route.post('/decode-assessment-url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { queryParams } = req.body;
        const bytes = crypto_js_1.default.AES.decrypt(queryParams, 'secret key 123');
        const originalText = bytes.toString(crypto_js_1.default.enc.Utf8);
        const [id, name] = originalText.split('&');
        const supplierId = id.split('=')[1];
        const supplierName = name.split('=')[1];
        const assessment = yield (0, assessment_1.createAssessment)({
            fornecedorId: supplierId,
            avaliacao: null,
            nomeAvaliador: supplierName,
            dataAvaliacao: (0, getDateTIme_1.formatDate)(date),
            texto: null,
            visivel: true
        });
        return res.status(201).send(assessment);
        /* const [baseUrl, encodeRoutes] = url.split('avaliacao')
        const bytes  = CryptoJS.AES.decrypt(encodeRoutes, 'secret key 123');
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const supplierId = originalText.split('/')[1]
        const supplierName = originalText.split('/')[2]
        const assessment = await createAssessment({
            id: supplierId,
            avaliacao: null,
            nomeAvaliador: supplierName,
            dataAvaliacao: formatDate(date),
            texto: null,
            visivel: true
        })
        return res.status(201).send({}) */
    }
    catch (err) {
        return res.status(400).send({ message: err.message });
    }
}));
app.use(route);
app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => 'server running on port 3333');
