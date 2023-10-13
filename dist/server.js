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
const express_2 = require("express");
const cors_1 = __importDefault(require("cors"));
const getDateTIme_1 = require("./utils/getDateTIme");
/* TODO: alterar para trazer SOMENTE os campos, não filtrar por eles. Ex: trazer o bairro, cidade e estado enquanto digita */
const supplier_1 = require("./database/tables/supplier");
const supplierSubCategory_1 = require("./database/tables/supplierSubCategory");
const app = (0, express_1.default)();
const route = (0, express_2.Router)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Fornecedor
// get all
route.get('/suppliers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const suppliers = yield (0, supplier_1.getSuppliers)();
    res.status(200).send(suppliers);
}));
// get one
route.get('/supplier/:id/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const supplier = yield (0, supplier_1.getSupplier)(id);
    res.status(200).send(supplier);
}));
// search by city 
route.get('/supplier-by-city/:city', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = req.params.city;
    const supplier = yield (0, supplier_1.getSupplierByCity)(city);
    res.status(200).send(supplier);
}));
// search by neighborhood, city or state
route.get('/supplier-by-neighborhood-city-state/:neighborhood/:city/:state', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const neighborhood = req.params.neighborhood;
    const city = req.params.city;
    const state = req.params.state;
    const supplier = yield (0, supplier_1.getSupplierByNeighborhoodCityState)(neighborhood, city, state);
    res.status(200).send(supplier);
}));
// search by neighborhood, city or state
route.get('/supplier-by-company-category-sub_category/:company/:category/:sub_category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const company = req.params.company;
    const category = req.params.category;
    const subCategory = req.params.sub_category;
    const supplier = yield (0, supplier_1.getSupplierByCompanyCategorySubCategory)(company, category, subCategory);
    res.status(200).send(supplier);
}));
// search results
route.get('/search-results/:place/:category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const caseMeMention = req.query.caseMeMention;
    const place = req.params.place;
    const category = req.params.category;
    const supplier = yield (0, supplier_1.searchSupplierByResults)(place, category, caseMeMention);
    res.status(200).send(supplier);
}));
// search by state
route.get('/supplier-by-state/:state', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const state = req.params.state;
    const supplier = yield (0, supplier_1.getSupplierByState)(state);
    res.status(200).send(supplier);
}));
// get all subcategories
route.get('/supplier/get-all-subcategories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const supplier = yield (0, supplier_1.getSupplierByState)(id);
    res.status(200).send(supplier);
}));
// create
route.post('/supplier/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const data = req.body;
    const params = Object.assign(Object.assign({}, data), { criado: (0, getDateTIme_1.formatDate)(date), modificado: (0, getDateTIme_1.formatDate)(date) });
    const supplier = yield (0, supplier_1.createSupplier)(params);
    res.status(200).send(supplier);
}));
// SubCategoriaFornecedor
// search by state
route.get('/suppliersSubCategory', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const suppliers = yield (0, supplierSubCategory_1.getSubCategories)();
    res.status(200).send(suppliers);
}));
app.use(route);
app.listen(3333, () => 'server running on port 3333');
