import { db } from '../service'

const tableName = 'Fornecedor'
const secondTableName = 'SubcategoriaFornecedor'
const thirdTableName = 'FornecedorSubcategoriaFornecedor'

export const getSuppliers = async () => {
    try {
        const [rows] = await db.query(`SELECT * FROM ${tableName};`)
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByNeighborhoodCityState = async (neighborhood: string, city: string, state: string) => {
    try {
        const [rows] = await db.query(`
        SELECT bairro, cidade, estado FROM ${tableName}
        WHERE bairro LIKE ? OR cidade LIKE ? OR estado LIKE ?;`, [`${neighborhood}%`, `${city}%`, `${state}%`])
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByCompanyCategorySubCategory = async (company: string, category: string, subCategory: string) => {
    try {
        const [supplierResponse]: any = await db.query(`SELECT supplier.id, supplier.empresa, supplier.Categorias
            FROM ${tableName} as supplier WHERE 
            supplier.empresa LIKE ? OR supplier.Categorias LIKE ?;`, [`${company}%`, `${category}%`, `${subCategory}%`])

        const [subCategoryResponse]: any = await db.query(`SELECT subCategorySupplier.nome, subCategorySupplier.id
            FROM ${secondTableName} as subCategorySupplier WHERE 
            subCategorySupplier.nome LIKE ?;`, [`${subCategory}%`])
        const [rows]: any = await db.query(`
            SELECT * FROM ${thirdTableName}
            WHERE subcategoriafornecedor_id = ? OR fornecedor_id = ?;`, [subCategoryResponse[0]?.id, supplierResponse[0]?.id])
        if (Object.keys(rows).length != 0) {
            const supplierBySubCategory = await db.query(`SELECT *
            FROM ${tableName} WHERE id = ?;`, [rows[0].fornecedor_id])
            return supplierBySubCategory[0]
        }
        return Object.assign(supplierResponse[0], subCategoryResponse[0])
    } catch (err) {
        console.log(err)
    }
}

export const searchSupplierByResults = async (place: string, category: string, caseMeMention: any) => {
    try {
        if (caseMeMention == 'true') {
            const supplierResponse: any = await db.query(`
                SELECT * FROM ${tableName}
                WHERE numTagsRef > 0 AND
                (bairro LIKE ?
                OR cidade LIKE ? 
                OR estado LIKE ?) AND
                Categorias LIKE ?;`, [`${place}%`, `${place}%`, `${place}%`, `${category}%`])
            const subCategoryResponse: any = await db.query(`SELECT subCategorySupplier.nome
                FROM ${secondTableName} as subCategorySupplier WHERE 
                subCategorySupplier.nome LIKE ?;`, [`${category}%`])
            const [rows]: any = await db.query(`
                SELECT * FROM ${thirdTableName}
                WHERE subcategoriafornecedor_id = ? OR fornecedor_id = ?;`, [subCategoryResponse[0]?.id, supplierResponse[0]?.id])
            if (Object.keys(rows).length != 0) {
                const supplierBySubCategory = await db.query(`SELECT *
                    FROM ${tableName} WHERE id = ?;`, [rows[0].fornecedor_id])
                return supplierBySubCategory[0]
            }
            return Object.assign(supplierResponse[0], subCategoryResponse[0])
        } else {
            const [supplierResponse]: any = await db.query(`
                SELECT * FROM ${tableName}
                WHERE (bairro LIKE ?
                OR cidade LIKE ? 
                OR estado LIKE ?) AND
                Categorias LIKE ?;`, [`${place}%`, `${place}%`, `${place}%`, `${category}%`])
            const [subCategoryResponse]: any = await db.query(`SELECT subCategorySupplier.id, subCategorySupplier.nome
                FROM ${secondTableName} as subCategorySupplier WHERE 
                subCategorySupplier.nome LIKE ?;`, [`${category}%`])
            const [rows]: any = await db.query(`
                SELECT * FROM ${thirdTableName}
                WHERE subcategoriafornecedor_id = ? OR fornecedor_id = ?;`, [subCategoryResponse[0]?.id, supplierResponse[0]?.id])
            if (Object.keys(rows).length != 0) {
                const supplierBySubCategory = await db.query(`SELECT *
                    FROM ${tableName} WHERE id = ?;`, [rows[0].fornecedor_id])
                return supplierBySubCategory[0]
            }
            return Object.assign(supplierResponse, subCategoryResponse)
        }

    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByCity = async (city: string) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableName}
        WHERE cidade LIKE ?;`, [`${city}%`])
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplierByState = async (state: string) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableName}
        WHERE estado LIKE ?;`, [`${state}%`])
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const getSupplier = async (id: string | number) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableName}
        WHERE id = ?;`, [id])
        return rows
    }
    catch (err) {
        console.log(err)
    }
}

export const getAllSubCategories = async (fornecedorId: string) => {
    try {
        const [rows]: any = await db.query(`
        SELECT * FROM ${thirdTableName}
        WHERE fornecedor_id = ?;`, [fornecedorId])
        if (Object.keys(rows).length != 0) {
            const response = await db.query(`
            SELECT * FROM ${secondTableName}
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
        ])
        let id = result.insertId
        return getSupplier(id)
    } catch (err) {
        console.log(err)
    }
}