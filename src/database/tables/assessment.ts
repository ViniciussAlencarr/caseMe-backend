import { db } from '../service'

import { tableNames } from './tableNames'

export const getAssessmentById = async (id: string | number) => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableNames.assessment}
        WHERE id = ?;`, [id])
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const createAssessment = async (data: any) => {
    try {
        const [suppliers]: any = await db.query(`SELECT id FROM ${tableNames.supplier} WHERE id = ?;`, [data.id])
        if (suppliers.length == 0) throw new Error(`O Fornecedor não existe para o id '${data.id}'`)
        await db.query(`
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
            data.visivel,
        ])
        return getAssessmentById(data.id)
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getAllAssessments = async () => {
    try {
        const [rows] = await db.query(`
        SELECT * FROM ${tableNames.assessment};`)
        return rows
    } catch (err) {
        console.log(err)
    }
}

export const deleteAssessment = async (id: string | number) => {
    try {
        const [rows] = await db.query(`
        DELETE FROM ${tableNames.assessment} WHERE id = ?;`, [id])
        return rows
    } catch (err) {
        console.log(err)
    }
}