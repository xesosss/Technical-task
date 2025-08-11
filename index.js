// initializing server

const express = require("express");
const { dbAll, dbGet, dbRun } = require("./db");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });

// Create session
app.use(
  session({
    secret: "admin21",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// add simple validation for check before update or add user

const validateUserInput = async ({
  first_name,
  last_name,
  gender,
  password,
  username,
  birthdate,
  id = null,
}) => {
  const nameRegex = /^[A-Za-zА-Яа-яЁё]+$/;
  const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (
    !first_name ||
    !last_name ||
    !gender ||
    !password ||
    !username ||
    !birthdate
  ) {
    return "Fields should not be empty";
  }

  if (!nameRegex.test(first_name)) {
    return "First name should consist only letters.";
  }

  if (!nameRegex.test(last_name)) {
    return "Last name should consist only letters.";
  }

  if (!birthdateRegex.test(birthdate)) {
    return "Unsupported birthdate format. Must be (YYYY-MM-DD)";
  }

  if (password.length < 6) {
    return "Password cannot be shorter than 6 characters";
  }
  if (!["Male", "Female"].includes(gender)) {
    return "Incorrect gender";
  }

  const existingUser = await dbGet("SELECT id FROM users WHERE username = ?", [
    username,
  ]);

  if (existingUser && (!id || existingUser.id !== parseInt(id))) {
    return "Username already exists";
  }

  return null;
};

const allowedSortFields = ["username", "first_name", "birthdate"];

// Authorization

const adminAuth = (req, res, next) => {
  if (req.session.adminId) {
    return next();
  }
  res.redirect("/"); // redirect unauthorize admin on auth form
};

// Auth form
app.get("/", csrfProtection, (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

app.post("/api/login", csrfProtection, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ result: "error", message: "Username and password required" });
  }

  try {
    const admin = await dbGet("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);
    if (!admin) {
      return res
        .status(400)
        .json({ result: "error", message: "Invalid username" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ result: "error", message: "Invalid password" });
    }

    req.session.adminId = admin.username;
    res.json({ result: "success", message: "Log in success. Redirecting..." });
  } catch (error) {
    console.error({
      message: "Log in error",
      error: error.stack || error,
      time: new Date().toISOString(),
    });
    res.status(500).json({ result: "error", message: "Something went wrong" });
  }
});

app.get("/api/logout", adminAuth, (req, res) => {
  try {
    req.session.destroy(() => {
      res.json({
        result: "success",
        message: "Log out success. Redirecting...",
      });
    });
  } catch (error) {
    console.error({
      message: "Log out error",
      error: error.stack || error,
      query: req.query,
      admin: req.session.adminId,
      time: new Date().toISOString(),
    });
    res.status(500).json({
      result: "error",
      message: "Something went wrong",
    });
  }
});

// Main Page

app.get("/main", csrfProtection, adminAuth, (req, res) => {
  res.render("index", { csrfToken: req.csrfToken() });
});

// add api for send user list

app.get("/api/users", adminAuth, async (req, res) => {
  let { page = 1, limit = 15, sort = "username" } = req.query;
  try {
    page = parseInt(page);
    limit = parseInt(limit);
    // OFFSET
    const startIndex = (page - 1) * limit;

    if (!allowedSortFields.includes(sort)) sort = "username";
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 15;

    const countRows = await dbGet(`SELECT COUNT(*) as count FROM users`);
    const totalPages = Math.ceil(countRows.count / limit);

    const users = await dbAll(
      `SELECT id,username,first_name,birthdate FROM users ORDER by ${sort} LIMIT ${limit} OFFSET ${startIndex}`
    );

    res.json({
      users,
      currentPage: page,
      totalPages,
      admin: req.session.adminId,
    });
  } catch (error) {
    console.error({
      message: "Database error. Cannot get users list",
      error: error.stack || error,
      query: req.query,
      admin: req.session.adminId,
      time: new Date().toISOString(),
    });
    res.status(500).json({
      result: "error",
      message: "Database error. Cannot get users list",
    });
  }
});

// api for send full info of 1 user
app.get("/api/about-user", adminAuth, async (req, res) => {
  try {
    let { id } = req.query;

    const userInfo = await dbGet(`SELECT * FROM users WHERE id=?`, [id]);

    res.json({ userInfo });
  } catch (error) {
    console.error({
      message: "Database error. Cannot get information about user",
      error: error.stack || error,
      query: req.query,
      admin: req.session.adminId,
      time: new Date().toISOString(),
    });
    res.status(500).json({
      result: "error",
      message: "Database error. Cannot get information about user",
    });
  }
});

// api for send new info about user in database
app.post("/api/update", csrfProtection, adminAuth, async (req, res) => {
  const { first_name, last_name, gender, password, username, birthdate, id } =
    req.body;

  const errorMsg = await validateUserInput(req.body);
  if (errorMsg)
    return res.status(400).json({ result: "error", message: errorMsg });
  try {
    await dbRun(
      `UPDATE users SET 
        first_name = ?, 
        last_name = ?, 
        gender = ?, 
        password = ?, 
        username = ?, 
        birthdate = ?
        WHERE id = ?`,
      [first_name, last_name, gender, password, username, birthdate, id]
    );
    res.json({ result: "success", message: "User data successful update" });
  } catch (error) {
    console.error({
      message: "User not update",
      error: error.stack || error,
      admin: req.session.adminId,
      time: new Date().toISOString(),
    });
    res.status(500).json({
      result: "error",
      message: "Something went wrong. Update not save",
    });
  }
});

// api for delete user from database

app.post("/api/delete-user", csrfProtection, adminAuth, async (req, res) => {
  const { id } = req.body;

  try {
    const result = await dbRun("DELETE FROM users WHERE id=?", [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ result: "error", message: "User not found" });
    }

    return res.json({ result: "success", message: "User successful deleted" });
  } catch (error) {
    console.error({
      message: "User not delete",
      error: error.stack || error,
      query: req.query,
      admin: req.session.adminId,
      time: new Date().toISOString(),
    });
    res.status(500).json({
      result: "error",
      message: "Something went wrong. User not delete",
    });
  }
});

//api for add new user in database

app.post("/api/add-user", csrfProtection, adminAuth, async (req, res) => {
  const { first_name, last_name, gender, password, username, birthdate } =
    req.body;

  const errorMsg = await validateUserInput(req.body);
  if (errorMsg)
    return res.status(400).json({ result: "error", message: errorMsg });
  try {
    await dbRun(
      `INSERT INTO users (first_name,last_name,gender,password,username,birthdate) VALUES (?,?,?,?,?,?)`,
      [first_name, last_name, gender, password, username, birthdate]
    );
    res.json({ result: "success", message: "User successful added" });
  } catch (error) {
    console.error({
      message: "User not added",
      error: error.stack || error,
      admin: req.session.adminId,
      time: new Date().toISOString(),
    });
    res.status(500).json({
      result: "error",
      message: "Something went wrong. User not added",
    });
  }
});

app.listen(3000, () => {});
