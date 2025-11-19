// scripts/add-users-encrypted.js
// Inserta usuarios con contraseñas bcrypt en tabla USUARIOS si no existen.

const sql = require('mssql');
require('dotenv').config();

const users = [
  { nombre: 'Facundo', mail: 'facundo@gmail.com', pass: '$2a$10$T1HNx/qDpJ6hAqsx4t8gAeKsQixHc5M9sDm2QFOPKZr/Bx2DppYiO', rol: 'ADMIN' },
  { nombre: 'Cristian', mail: 'cristian@gmail.com', pass: '$2a$10$Zxp4iFvZ7FqCEYoQJLffv.dNM6k97kN88GTg7wXzj9oGoR1dSklmq', rol: 'ADMIN' },
  { nombre: 'Gustavo', mail: 'gustavo@gmail.com', pass: '$2a$10$HLr20ZCqb72MYgFqYiJEEesYaZXk1KWO5EQ8kfyPQEO5.mXyhyIDy', rol: 'ADMIN' },
  { nombre: 'Julian', mail: 'julian@gmail.com', pass: '$2a$10$6suMuhxXlYjfoNxqGa1tH.tIRUvY7C4033ttTa3twfnzj.2q6bI.y', rol: 'ADMIN' },
  { nombre: 'Iara', mail: 'iara@gmail.com', pass: '$2a$10$eIp1tNZHchgkdUxqdevBoObHNSsRHumgA6qF9EudFv..0NmEK09oa', rol: 'ADMIN' },
  { nombre: 'Carlos', mail: 'empleado@gmail.com', pass: '$2a$10$NJHCFBviirpFUJZVjcGja.Zk0TtwXqftEdmRMjprkaHm31D/hpCTK', rol: 'EMPLEADO' }
];

async function main() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '1433'),
    options: { encrypt: false, trustServerCertificate: true }
  };
  console.log('[ADD-USERS] Conectando a BD...');
  const pool = await sql.connect(config);

  for (const u of users) {
    const exists = await pool.request().input('mail', sql.VarChar, u.mail)
      .query('SELECT 1 FROM USUARIOS WHERE MAIL=@mail');
    if (exists.recordset.length) {
      console.log(`[ADD-USERS] Ya existe: ${u.mail}`);
      continue;
    }
    await pool.request()
      .input('nombre', sql.VarChar, u.nombre)
      .input('mail', sql.VarChar, u.mail)
      .input('pass', sql.VarChar, u.pass)
      .input('rol', sql.VarChar, u.rol)
      // Escapar columna con ñ
      .query('INSERT INTO USUARIOS (NOMBRE_COMPLETO, MAIL, [CONTRASEÑA], ROL) VALUES (@nombre, @mail, @pass, @rol)');
    console.log(`[ADD-USERS] Insertado ${u.mail}`);
  }

  const count = await pool.request().query('SELECT COUNT(*) AS total FROM USUARIOS');
  console.log(`[ADD-USERS] Total usuarios: ${count.recordset[0].total}`);
  await pool.close();
  process.exit(0);
}

main().catch(e => { console.error('[ADD-USERS] Error:', e); process.exit(1); });
