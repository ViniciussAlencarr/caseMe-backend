import { db } from '../service'

import { tableNames } from './tableNames'

export const getSuppliers = async () => {
    try {
        const [rows] = await db.query(`SELECT DISTINCT 
        t1.id,
        t1.empresa,
        t1.Categorias,
        t1.estado,
        t1.cidade,
        t1.numTagsRef,
        t3.nome FROM ${tableNames.supplier} as t1 RIGHT JOIN ${tableNames.supplierSubCategory} as t2
        ON t1.id = t2.fornecedor_id RIGHT JOIN ${tableNames.subCategories} as t3 ON t3.id = t2.subcategoriafornecedor_id;`)
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByNeighborhoodCityState = async (value: string) => {
    try {
        const [rows] = await db.query(`
        SELECT DISTINCT bairro, cidade, estado,
        CASE WHEN bairro LIKE '%${value}%' THEN
        bairro WHEN cidade LIKE '%${value}%' THEN
        cidade WHEN estado LIKE '%${value}%'THEN
        estado ELSE NULL END AS result FROM ${tableNames.supplier}
        `)
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByCompanyCategorySubCategory = async (company: string, category: string, subCategory: string) => {
    try {
        const [suppliers] = await db.query(`SELECT t1.empresa, t1.Categorias,
        CASE WHEN t1.empresa LIKE '%${company}%' THEN
        t1.empresa WHEN t1.Categorias LIKE '%${company}%' THEN t1.Categorias ELSE NULL END AS result
        FROM ${tableNames.supplier} as t1;`)
        const [subCategories] = await db.query(`SELECT nome,
        CASE WHEN nome LIKE '%${company}%' THEN
        nome ELSE NULL END AS result
        FROM ${tableNames.subCategories};`)
        return Object.assign(suppliers, subCategories)
    } catch (err) {
        console.log(err)
    }
}

export const searchSupplierByResults = async (place: string, category: string, caseMeMention: any) => {
    try {
        if (caseMeMention == 'true') {
            const [supplierResponse]: any = await db.query(`
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
            [`%${place}%`, `%${place}%`, `%${place}%`, `%${category}%`, `%${category}%`, `%${category}%`])
            return supplierResponse
        } else {
            const [supplierResponse]: any = await db.query(`
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
            [`%${place}%`, `%${place}%`, `%${place}%`, `%${category}%`, `%${category}%`, `%${category}%`])
            return supplierResponse
        }

    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByCity = async (city: string) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableNames.supplier}
        WHERE cidade LIKE ?;`, [`%${city}%`])
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByState = async (state: string) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableNames.supplier}
        WHERE estado LIKE ?;`, [`%${state}%`])
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplier = async (id: string | number) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableNames.supplier}
        WHERE id = ?;`, [id])
        return rows
    }
    catch (err) {
        console.log(err)
    }
}
export const getAllSubCategories = async () => {
    try {
        const [rows] = await db.query(`SELECT * FROM ${tableNames.subCategories};`)
        return rows
    }
    catch (err) {
        console.log(err)
    }
}
export const getAllSubCategoriesBySupplier = async (fornecedorId: string) => {
    try {
        const [rows]: any = await db.query(`
        SELECT * FROM ${tableNames.supplierSubCategory}
        WHERE fornecedor_id = ?;`, [fornecedorId])
        if (Object.keys(rows).length != 0) {
            const response = await db.query(`
            SELECT * FROM ${tableNames.subCategories}
            WHERE id = ?;`, [rows[0].subcategoriafornecedor_id])
            return response[0]
        } 
        return []
    }
    catch (err) {
        console.log(err)
    }
}

export const createSupplier = async (data: any) => {
    try {
        const [result]: any = await db.query(`
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
        ])
        let id = result.insertId
        return getSupplier(id)
    } catch (err) {
        console.log(err)
    }
}