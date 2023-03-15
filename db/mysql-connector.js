import mysql from "mysql2";
import config from "../config";

const pool = mysql.createPool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPass,
  database: config.dbName,
  connectionLimit: 100,
  debug: false,
  queueLimit: 0
});

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      //console.log("MySQL pool connected: threadId " + connection.threadId);
      const query = (sql, binding) => {
        
        return new Promise((resolve, reject) => {
          
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            if (!Array.isArray(result)) {
              resolve(result);
            } else {
              resolve(JSON.parse(JSON.stringify(result[0])));
            }
          });
        });
      };
      const rawquery = (sql, binding) => {
       
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });
      };
      const release = () => {
        return new Promise((resolve, reject) => {
          if (err) reject(err);
          //console.log("MySQL pool released: threadId " + connection.threadId);
          resolve(connection.release());
        });
      };
      resolve({ rawquery, query, release });
    });
  });
};
const query = (sql, binding) => {
  //console.log('abc',sql);
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
pool.on('release', function (connection) {
  //console.log('Connection %d released', connection.threadId);
});
export default { pool, connection, query };
