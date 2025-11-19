const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

const getConnection = async () => {
    try {
        if (pool) {
            return pool;
        }
        pool = await sql.connect(config);
        console.log('Conectado a SQL Server (' + config.server + ':' + config.port + ')');
        return pool;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        throw error;
    }
};

const closeConnection = async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('Conexión a SQL Server cerrada');
        }
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
        throw error;
    }
};

module.exports = {
    sql,
    getConnection,
    closeConnection
};
