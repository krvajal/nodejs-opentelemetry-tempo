import log4js from 'log4js';
import sql from 'mssql';
import {queryGetFlightById} from './queries';

const logger = log4js.getLogger("dao");
logger.level = "debug";

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,  
    database: process.env.DB_NAME,  
    connectionTimeout: 3000,
    requestTimeout: 3000,
    options: {
        enableArithAbort: true,
        encrypt: true,
    },
    pool: {
        max: 100,
        min: 1, //don't close all the connections.
        idleTimeoutMillis: 1000,
        evictionRunIntervalMillis: 1500000
    }
};

const pool = new sql.ConnectionPool(config, (err) => {
    if (err) {
        logger.error("SQL Connection Establishment ERROR: %s", err);
    } else {
        logger.debug('SQL Connection established...');
    }
});

sql.on('error', err => {
    logger.error("SQL Connection Error : %s", err);
});

export const getFlightById = (flightId) => {
    const request = new sql.Request(pool);

    let query = queryGetFlightById();

    request
        .input('flightId', sql.Int, flightId)
        .query(query)
        .then((result) => {
            logger.info(result.recordset);
        }).catch(err => {
            logger.error(err);
        });
};