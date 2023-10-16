import express from 'express'

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
    getAllSubCategories,
    getAllSubCategoriesBySupplier
} from './database/tables/supplier'


const app = express();

const route = Router()

app.use(express.json())
app.use(cors())

// Fornecedor
// get all
route.get('/suppliers', async (req: Request, res: Response) => {
    const suppliers = await getSuppliers()
    res.status(200).send(suppliers)
})
// get one
route.get('/supplier/:id/', async (req: Request, res: Response) => {
    const id = req.params.id
    const supplier = await getSupplier(id)
    res.status(200).send(supplier)
})
// search by city 
route.get('/supplier-by-city/:city', async (req: Request, res: Response) => {
    const city = req.params.city
    const supplier = await getSupplierByCity(city)
    res.status(200).send(supplier)
})
// search by neighborhood, city or state
route.get('/supplier-by-neighborhood-city-state/:neighborhood/:city/:state', async (req: Request, res: Response) => {
    const neighborhood = req.params.neighborhood
    const city = req.params.city
    const state = req.params.state
    const supplier = await getSupplierByNeighborhoodCityState(neighborhood, city, state)
    res.status(200).send(supplier)
})
// search by neighborhood, city or state
route.get('/supplier-by-company-category-sub_category/:company/:category/:sub_category', async (req: Request, res: Response) => {
    const company = req.params.company
    const category = req.params.category
    const subCategory = req.params.sub_category
    const supplier = await getSupplierByCompanyCategorySubCategory(company, category, subCategory)
    res.status(200).send(supplier)
})
// search results
route.get('/search-results/:place/:category', async (req: Request, res: Response) => {
    const caseMeMention = req.query.caseMeMention
    const place = req.params.place
    const category = req.params.category
    const supplier = await searchSupplierByResults(place, category, caseMeMention)
    res.status(200).send(supplier)
})
// search by state
route.get('/supplier-by-state/:state', async (req: Request, res: Response) => {
    const state = req.params.state
    const supplier = await getSupplierByState(state)
    res.status(200).send(supplier)
})
// get all subcategories
route.get('/sub-categories', async (req: Request, res: Response) => {
    const subCategories = await getAllSubCategories()
    res.status(200).send(subCategories)
})

// get all subcategories by supplier
route.get('/supplier/get-all-subcategories/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const supplier = await getAllSubCategoriesBySupplier(id)
    res.status(200).send(supplier)
})
// create
route.post('/supplier/create', async (req: Request, res: Response) => {
    const date = new Date()
    const data = req.body
    const params = {
        ...data,
        criado: formatDate(date),
        modificado: formatDate(date),
    }
    const supplier = await createSupplier(params)
    res.status(200).send(supplier)
})


app.use(route)

app.listen(process.env.PORT ? Number(process.env.PORT) : 3333, () => 'server running on port 3333')


























