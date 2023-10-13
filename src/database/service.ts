import mysql from 'mysql2';
import config from './config'

export const db = mysql.createConnection(config).promise();