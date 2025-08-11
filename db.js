const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "users",
});

module.exports = {
  dbAll: async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  dbGet: async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows[0];
  },

  dbRun: async (sql, params = []) => {
    const [result] = await pool.execute(sql, params);
    return result;
  },
};
