const fs = require("fs");
// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    ca: `
    -----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUTDnNRvI6JwFwFydBDBma81Dh8igwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1NzczMjkwYzUtY2JiNS00ODg4LWFiMjEtZDIzYzRmOGMy
YzY1IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUxMDAzMjAxNTA2WhcNMzUxMDAxMjAx
NTA2WjBAMT4wPAYDVQQDDDU3NzMyOTBjNS1jYmI1LTQ4ODgtYWIyMS1kMjNjNGY4
YzJjNjUgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBALgAv1VWoxyRjiVuLKStewDbA70NE9fpYLi+kFG5sUld70OVEDXfz1oE
LItgKu86qvRlWAkPhYhArJKM2eldVlBmI/XF5OPJ88beu/eWXcc5NVGYaBjI463/
J7gO//zjjvvu6Yh+Vu25T+iyq0t3zLun1irHbV3IelFh3b92mNU6hnZ4xGFfLgQb
PqzwaL8l0AIlXNvA2o4R8D40XuED3H5vJ332odc4Bg+v4F2fSCp4DA/HhyWUfdEV
l2EwgLBagYS1t0VD5/eGHmRAl3pLoZ/dqc7RuOlpbM7UML+E7tlzTagi3jMQurfJ
NXtl4mEWr3Bxq8x+yH9XpoVI0jBD8/iUgDk8LJOmmPs8XkocpbMSnt23t4ZYSF84
AKfMZGx9D3ByC0GbdvN9tcvhP9Zyp96afFAJjosnr2GsLrK5nDMIk0AqJdd6JTVe
nY418KMmky5Bq+wWBuGI2ZJH8Lo0tJVF2CH08GSfIbCVVjdOLiv+yVKcTLMFXNon
DM1ZyV95+QIDAQABo0IwQDAdBgNVHQ4EFgQUBm40n8vxKET362VIiVO5/oLZqyMw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBAEdAbBbZ6GX/GVE8pnSwgLIT+LqqC1hJlopoU7FBcyo89LXtFY2FM2pgXPpb
vKPv9fT+F2mQhiYWfcFffnYGTKeLCjxZ07+NSbfeZ4r02bN7UhKIHYsEH17tsxQz
t8uBwO4TX8ufKvKS23BjBkckOYl7wXvp73yEkagqt15EChrAJE3NcCc9YXJgKsIi
dFhfSSkA9FmGRw3Jdb8C5iXWDDP+6dQHZc6avVFFkUQcS0B5eFo79XcOGmKjvPKg
zhWZepCH9uZPSKPoNmCUy6Way0XD/hD9J8IiIp4YfKBT1ucClfSkrtXrsTrdg0tX
fTSf8rDh2Ue0yl9U7pVw+TCqUIdlrbJpnnM7OdPXi+xibMWqVp8teCOIPLY2dObt
eU3UIBGOWTS+beCFDLFbuSv4e1tBAjlP5aN6G6kk3lPnIX+05c9kg/rKMcmnC6cI
bam9Y34D97TSr6OGGgKFei4eiMYfpCY/iZgEq0Vp3GJchbeqVEr8zQ6hJyrAk77W
2I0KSw==
-----END CERTIFICATE-----
    `
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('🔌 Conectado ao banco de dados MySQL com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o banco de dados:', err);
  });

module.exports = pool;