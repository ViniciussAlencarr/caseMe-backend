import { db } from '../service'

import { tableNames } from './tableNames'

export const getSuppliers = async (queryParams: any) => {
    try {
        const [rows] = await db.query(`
        SELECT
            t1.id,
            t1.empresa,
            t1.estado,
            t1.cidade,
            t1.numTagsRef,
            t4.nome,
            COUNT(t2.id) as totalAvaliacoes,
            ROUND(AVG(t2.avaliacao)) as mediaAvaliacao
        FROM
            ${tableNames.supplier} as t1
        LEFT JOIN
            ${tableNames.assessment} as t2
        ON 
            t1.id = t2.fornecedorId
        LEFT JOIN
            ${tableNames.supplierSubCategory} as t3
        ON
            t1.id = t3.fornecedor_id
        INNER JOIN
            ${tableNames.subCategories} as t4
        ON
            t4.id = t3.subcategoriafornecedor_id
        group by
            t1.id, t4.nome
        ORDER BY id LIMIT ? OFFSET ?
        `,
        [parseInt(queryParams.perPage), parseInt(queryParams.page)])
        return rows
    } catch (err) {
        console.log('deu ruim')
    }
}

const getAllMention = async () => {
    try {
        const [rows] = await db.query(`
        SELECT 
            t1.id as fornecedor_id, count(*) as mentions
        FROM
            ${tableNames.supplier} as t1
        INNER JOIN
            wp_terms as t2
        ON
            t1.slug = t2.slug
        INNER JOIN
            wp_term_taxonomy as t3
        ON
            t2.term_id = t3.term_taxonomy_id
        INNER JOIN
            wp_term_relationships as t4
        ON
            t3.term_taxonomy_id = t4.term_taxonomy_id
        INNER JOIN
            wp_posts as t5
        ON
            t4.object_id = t5.id
        AND
            t5.post_status = 'publish' group by t1.id
        `)
        return rows;
    } catch (err) {
        throw err
    }
}

const getInsprations = async () => {
    try {
        const [rows] = await db.query(`
        SELECT
            t2.id as fornecedor_id, count(*) as inspirations
        FROM
            ${tableNames.inspirations} as t1
        INNER JOIN
            ${tableNames.supplier} as t2
        ON
            t1.tags
        LIKE
            CONCAT('%', t2.slug, '%') group by t2.id`)
        return rows
    } catch (err) {
        throw err
    }
}

export const getAverageOfAssessments = async () => {
    try {
        
        /* const [rows] = await db.query(`INSERT INTO ${tableNames.assessment} (fornecedorId, nomeAvaliador, avaliacao)
        SELECT id, empresa, floor(rand()*5)+1
        FROM ${tableNames.supplier}
        `) */
        return []
    } catch (err) {
        console.log(err)
    }
}

/* TODO: finalizar */
export const teste = async () => {
    try {
        /* const mentions = await getAllMention() */
        const inspirations = await getInsprations()
        /* const [rows] = await db.query(`SELECT
        (SELECT COUNT(*) FROM ${tableNames.supplier} WHERE id < 5) +
        (SELECT COUNT(*) FROM ${tableNames.inspirations} as t1 INNER JOIN ${tableNames.supplier} as t2 WHERE t.id < 5)
        AS SumCount`) */
        return inspirations
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

export const searchSupplierByResults = async (place: string, caseMeMention: any) => {
    try {
        if (caseMeMention == 'true') {
            const [supplierResponse] = await db.query(`
                SELECT
                    t1.id,
                    t1.empresa,
                    t1.estado,
                    t1.cidade,
                    t1.numTagsRef,
                    t4.nome,
                    COUNT(t2.id) as totalAvaliacoes,
                    ROUND(AVG(t2.avaliacao)) as mediaAvaliacao
                FROM
                    ${tableNames.supplier} as t1
                
                LEFT JOIN
                    ${tableNames.assessment} as t2
                ON 
                    t1.id = t2.fornecedorId
                LEFT JOIN
                    ${tableNames.supplierSubCategory} as t3
                ON
                    t1.id = t3.fornecedor_id
                INNER JOIN
                    ${tableNames.subCategories} as t4
                ON
                    t4.id = t3.subcategoriafornecedor_id
                WHERE
                    t1.numTagsRef > 0
                AND
                    (t1.bairro REGEXP ?
                OR
                    (t1.cidade REGEXP ?
                OR
                    (t1.estado REGEXP ?)))
                AND 
                    ((t1.empresa REGEXP ?) OR (t1.Categorias REGEXP ?) OR (t4.nome REGEXP ?))
                group by
                    t1.id, t4.nome;`,
            [place, place, place, place, place, place])
            return supplierResponse
        } else {
            const [supplierResponse] = await db.query(`
                SELECT
                    t1.id,
                    t1.empresa,
                    t1.estado,
                    t1.cidade,
                    t1.numTagsRef,
                    t4.nome,
                    COUNT(t2.id) as totalAvaliacoes,
                    ROUND(AVG(t2.avaliacao)) as mediaAvaliacao
                FROM
                    ${tableNames.supplier} as t1
                
                LEFT JOIN
                    ${tableNames.assessment} as t2
                ON 
                    t1.id = t2.fornecedorId
                LEFT JOIN
                    ${tableNames.supplierSubCategory} as t3
                ON
                    t1.id = t3.fornecedor_id
                INNER JOIN
                    ${tableNames.subCategories} as t4
                ON
                    t4.id = t3.subcategoriafornecedor_id
                WHERE
                    (t1.bairro REGEXP ?
                OR
                    (t1.cidade REGEXP ?
                OR
                    (t1.estado REGEXP ?)))
                AND 
                    ((t1.empresa REGEXP ?) OR (t1.Categorias REGEXP ?) OR (t4.nome REGEXP ?))
                group by
                    t1.id, t4.nome
                `,
            [place, place, place, place, place, place])
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