/* Import dependencies */
import express from "express";
import path from "path";
import session from "express-session";
import bcrypt from "bcrypt";

// Import controllers
import * as countryController from "./controllers/country.controller.mjs";
import * as cityController from "./controllers/city.controller.mjs";
import * as capitalController from "./controllers/capital.controller.mjs";
import * as urbanRuralController from "./controllers/urbanRural.controller.mjs";
import * as languageController from "./controllers/language.controller.mjs";
import * as populationController from "./controllers/population.controller.mjs";

/* Create express instance */
const app = express();
const port = 3000;

/* Add form data middleware */
app.use(express.urlencoded({ extended: true }));
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Use the pug template engine
app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'views'));

//Add a static files location
app.use(express.static("static"));


/* Routes */

// Landing route
app.get("/", (req, res) => {
    res.redirect("/population");
});
// app.get("/about",);
// app.get("/contact");
app.get("/population", populationController.getPopulation);
app.get("/capitals", capitalController.getCapitals);
app.get("/countries", countryController.getCountries);
app.get("/cities", cityController.getCities);
app.get("/urbanRural", urbanRuralController.getUrbanRuralPopulation);
app.get("/languages", languageController.getLanguages);

/* Authentication */
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
// Register
app.get("/register", (req, res) => {
    res.render("register");
});

// Login
app.get("/login", (req, res) => {
    res.render("login");
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
    });
// Account
app.get("/account", async (req, res) => {
    const { auth, userId } = req.session;

    if (!auth) {
        return res.redirect("/login");
    }

    const sql = `SELECT id, email FROM user WHERE user.id = ${userId}`;
    const [results, cols] = await conn.execute(sql);
    const user = results[0];

    res.render("account", { user });
});

app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const sql = `INSERT INTO user (email, password) VALUES ('${email}', '${hashed}')`;
        const [result, _] = await conn.execute(sql);
        const id = result.insertId;
        req.session.auth = true;
        req.session.userId = id;
        return res.redirect("/account");
    } catch (err) {
        console.error(err);
        return res.status(400).send(err.sqlMessage);
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).send("Missing credentials");
    }

    const sql = `SELECT id, password FROM user WHERE email = '${email}'`;
    const [results, cols] = await conn.execute(sql);

    const user = results[0];

    if (!user) {
        return res.status(401).send("User does not exist");
    }

    const { id } = user;
    const hash = user?.password;
    const match = await bcrypt.compare(password, hash);

    if (!match) {
        return res.status(401).send("Invalid password");
    }

    req.session.auth = true;
    req.session.userId = id;

    return res.redirect("/account");
});


// Run server!
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
