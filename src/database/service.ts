import mysql from 'mysql2';
import config from './config'
const pool = mysql.createPool(config);
export const db = pool.promise();