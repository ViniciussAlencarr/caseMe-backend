import express from 'express'

import CryptoJS from 'crypto-js'

import { Router, Request, Response } from 'express';

import cors from 'cors';

import { formatDate } from './utils/getDateTIme';
/* TODO: alterar para trazer SOMENTE os campos, não filtrar por eles. Ex: trazer o bairro, cidade e estado enquanto digita */

import {
    createSupplier,
    getSupplier,
    getSuppliers,
    getSupplierByCity,
    getSupplierByState,
    getSupplierByNeighborhoodCityState,
    getSupplierByCompanyCategorySubCategory,
    searchSupplierByResults,
    teste,
    getAverageOfAssessments
} from './database/tables/supplier'

import {
    getAllSubCategories,
    getAllSubCategoriesBySupplier,
    createSubCategory
} from './database/tables/supplierSubCategory'

import {
    getAllAssessments,
    deleteAssessment,
    createAssessment
} from './database/tables/assessment'

const date = new Date()

const app = express();
const route = Router()

app.use(express.json())
app.use(cors())

// Fornecedor
// get all
route.get('/suppliers', async (req: Request, res: Response) => {
    let params = Object.keys(req.query).length != 0 ? req.query : {
        page: '0',
        perPage: '15'
    }
    const suppliers = await getSuppliers(params)
    return res.status(200).send(suppliers)
})
// get one
route.get('/supplier/:id/', async (req: Request, res: Response) => {
    const id = req.params.id
    const supplier = await getSupplier(id)
    return res.status(200).send(supplier)
})
// search by city 
route.get('/supplier-by-city/:city', async (req: Request, res: Response) => {
    const city = req.params.city
    const supplier = await getSupplierByCity(city)
    return res.status(200).send(supplier)
})
// search by neighborhood, city or state
route.get('/supplier-by-neighborhood-city-state/:conditionValue', async (req: Request, res: Response) => {
    const conditionValue = req.params.conditionValue
    const supplier = await getSupplierByNeighborhoodCityState(conditionValue)
    return res.status(200).send(supplier)
})
// search by neighborhood, city or state
route.get('/supplier-by-company-category-sub_category/:company/:category/:sub_category', async (req: Request, res: Response) => {
    const company = req.params.company
    const category = req.params.category
    const subCategory = req.params.sub_category
    const supplier = await getSupplierByCompanyCategorySubCategory(company, category, subCategory)
    return res.status(200).send(supplier)
})
// search results
route.get('/search-results/:researches', async (req: Request, res: Response) => {
    const caseMeMention = req.query.caseMeMention
    const researches = req.params.researches
    const suppliers = await searchSupplierByResults(researches, caseMeMention)
    return res.status(200).send(suppliers)
})
// search by state
route.get('/supplier-by-state/:state', async (req: Request, res: Response) => {
    const state = req.params.state
    const supplier = await getSupplierByState(state)
    return res.status(200).send(supplier)
})
// get all subcategories
route.get('/sub-categories', async (req: Request, res: Response) => {
    const subCategories = await getAllSubCategories()
    return res.status(200).send(subCategories)
})

// get all subcategories by supplier
route.get('/supplier/get-all-subcategories/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const supplier = await getAllSubCategoriesBySupplier(id)
    return res.status(200).send(supplier)
})
route.post('/sub-category/new', async (req: Request, res: Response) => {
    const data = req.body
    const params = {
        ...data,
        criado: formatDate(date),
        modificado: formatDate(date),
    }
    const subCategory = await createSubCategory(params)
    return res.status(200).send(subCategory)
})

// create
route.post('/supplier/create', async (req: Request, res: Response) => {
    const data = req.body
    const params = {
        ...data,
        criado: formatDate(date),
        modificado: formatDate(date),
    }
    const supplier = await createSupplier(params)
    return res.status(201).send(supplier)
})
route.get('/teste', async (req: Request, res: Response) => {
    const suppliers = await teste()
    return res.status(200).send(suppliers)
})
// assessments
route.get('/assessments', async (req: Request, res: Response) => {
    const assessments = await getAllAssessments()
    return res.status(200).send(assessments)
})
route.get('/assessment-average', async (req: Request, res: Response) => {
    const assessments = await getAverageOfAssessments()
    return res.status(200).send(assessments)
})
route.post('/assessment/create', async (req: Request, res: Response) => {
    try {
        const data = req.body
        const params = {
            ...data,
            dataAvaliacao: formatDate(date)
        }
        const assessment = await createAssessment(params)
        return res.status(201).send(assessment)
    } catch (err: any) {
        console.log(err)
        return res.status(400).send({ message: err.message })
    }
})
route.delete('/assessment/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const assessment = await deleteAssessment(id)
    return res.status(201).send(assessment)
})
// decode assessment
route.post('/encode-assessment-url', async (req: Request, res: Response) => {
    try {
        const { url } = req.body
        const [baseUrl, decodeRoutes] = url.split('avaliacao')
        const ciphertext = CryptoJS.AES.encrypt(decodeRoutes.substring(1), 'secret key 123').toString();
        return res.status(201).send({
            url: `${baseUrl}avaliacao?${ciphertext}`
        })
    } catch (err: any) {
        return res.status(400).send({ message: err.message })
    }
})

// decode assessment
route.post('/decode-assessment-url', async (req: Request, res: Response) => {
    try {
        const { queryParams } = req.body
        const bytes  = CryptoJS.AES.decrypt(queryParams, 'secret key 123');
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const [id, name] = originalText.split('&')
        const supplierId = id.split('=')[1]
        const supplierName = name.split('=')[1]
        const assessment = await createAssessment({
            fornecedorId: supplierId,
            avaliacao: null,
            nomeAvaliador: supplierName,
            dataAvaliacao: formatDate(date),
            texto: null,
            visivel: true
        })
        return res.status(201).send(assessment)

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
    } catch (err: any) {
        return res.status(400).send({ message: err.message })
    }
})

app.use(route)

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => 'server running on port 3333')


























