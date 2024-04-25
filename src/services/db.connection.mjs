import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host : process.env.DATABASE_HOST || "localhost",
  user : "user",
  password : "password",
  database : "world",
  connectionLimit : 11,
  waitForConnections: true
});
  
export default pool;