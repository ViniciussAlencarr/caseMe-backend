import { db } from '../service'

import { tableNames } from './tableNames'

export const getAllSubCategories = async () => {
    try {
        const [rows] = await db.query(`SELECT * FROM ${tableNames.subCategories};`)
        return rows
    }
    catch (err) {
        console.log(err)
    }
}

export const getSubCategoryById = async (id: number | string) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableNames.subCategories}
        WHERE id = ?;`, [id])
        return rows
    } catch (err) {
        console.log(err)
    }
}


export const getAllSubCategoriesBySupplier = async (fornecedorId: string) => {
    try {
        const [rows] = await db.query(`
            SELECT t2.* FROM 
                ${tableNames.supplierSubCategory} as t1
            
            RIGHT JOIN
                ${tableNames.subCategories} as t2
            ON t2.id = t1.subcategoriafornecedor_id  WHERE t1.fornecedor_id = ?

        `, [fornecedorId]) 
        return rows
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
        console.log(err)
    }
}


export const createSubCategory = async (data: any) => {
    try {
        const [result]: any = await db.query(`
        INSERT INTO ${tableNames.subCategories} (
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
        ])
        let id = result.insertId
        return getSubCategoryById(id)
    } catch (err) {
        console.log(err)
    }
}