// scripts/init-db.js
// Inicializa la base ASGP_DB en RDS: crea BD si no existe, tablas y datos con contraseñas encriptadas
// Usa mssql y ejecuta los scripts SQL con separador GO.

const fs = require('fs');
const path = require('path');
const sql = require('mssql');
require('dotenv').config();

const endpoint = process.env.DB_SERVER;
const adminUser = process.env.DB_USER;
const adminPass = process.env.DB_PASSWORD;
const targetDb = process.env.DB_DATABASE || 'ASGP_DB';
const port = parseInt(process.env.DB_PORT || '1433');

const schemaFile = path.join(__dirname, '../../database/ASGP_DB.sql');
const usersFile = path.join(__dirname, '../../database/usuarios-encriptados.sql');

function splitBatches(raw) {
  // Divide por líneas que sólo contienen GO (ignorando espacios)
  const lines = raw.split(/\r?\n/);
  const batches = [];
  let current = [];
  for (const line of lines) {
    if (/^\s*GO\s*$/i.test(line)) {
      if (current.length) {
        batches.push(current.join('\n'));
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length) batches.push(current.join('\n'));
  return batches.filter(b => b.trim().length);
}

async function runBatch(pool, batch) {
  try {
    await pool.request().batch(batch);
  } catch (err) {
    // Algunos lotes pueden fallar si ya existen objetos; mostramos advertencia y seguimos
    console.warn('\n[WARN] Fallo en lote, se continúa:', err.message);
  }
}

async function main() {
  console.log(`\n[INIT-DB] Conectando a servidor ${endpoint}:${port} como ${adminUser}`);

  // Conexión a master para crear DB si falta
  let masterPool = await sql.connect({
    user: adminUser,
    password: adminPass,
    server: endpoint,
    port,
    database: 'master',
    options: { encrypt: false, trustServerCertificate: true }
  });

  const checkDb = await masterPool.request().query(`SELECT name FROM sys.databases WHERE name='${targetDb}'`);
  if (checkDb.recordset.length === 0) {
    console.log(`[INIT-DB] Creando base de datos ${targetDb}...`);
    await masterPool.request().query(`CREATE DATABASE ${targetDb}`);
  } else {
    console.log(`[INIT-DB] Base ${targetDb} ya existe`);
  }
  await masterPool.close();

  // Conectar a la base objetivo
  let targetPool = await sql.connect({
    user: adminUser,
    password: adminPass,
    server: endpoint,
    port,
    database: targetDb,
    options: { encrypt: false, trustServerCertificate: true }
  });

  // Leer y ejecutar schema (ignora inserts de usuarios sin encriptar)
  const rawSchema = fs.readFileSync(schemaFile, 'utf8');
  // Eliminamos inserts de usuarios con contraseñas sin encriptar (se usarán hashes después)
  const cleaned = rawSchema.replace(/INSERT INTO USUARIOS[\s\S]*?GO/gi, '-- REMOVIDO INSERT USUARIOS NO ENCRIPTADOS\nGO');
  const batches = splitBatches(cleaned);
  console.log(`[INIT-DB] Ejecutando ${batches.length} lotes del schema`);
  for (const b of batches) {
    await runBatch(targetPool, b);
  }

  // Ejecutar usuarios encriptados
  console.log('[INIT-DB] Insertando usuarios con contraseñas encriptadas');
  const rawUsers = fs.readFileSync(usersFile, 'utf8');
  const userBatches = splitBatches(rawUsers);
  for (const ub of userBatches) {
    await runBatch(targetPool, ub);
  }

  // Verificar conteos
  const usuarios = await targetPool.request().query('SELECT COUNT(*) AS total FROM USUARIOS');
  const productos = await targetPool.request().query('SELECT COUNT(*) AS total FROM PRODUCTOS');
  const stock = await targetPool.request().query('SELECT COUNT(*) AS total FROM STOCK');

  console.log(`\n[INIT-DB] Resumen:`);
  console.log(`   USUARIOS: ${usuarios.recordset[0].total}`);
  console.log(`   PRODUCTOS: ${productos.recordset[0].total}`);
  console.log(`   STOCK: ${stock.recordset[0].total}`);

  await targetPool.close();
  console.log('\n[INIT-DB] Finalizado OK');
  process.exit(0);
}

main().catch(err => {
  console.error('[INIT-DB] Error fatal:', err);
  process.exit(1);
});
