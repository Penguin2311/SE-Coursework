/* Import dependencies */
import express from "express";
import DatabaseService from "./services/database.service.mjs";

// Import controllers
import * as countryController from "./controllers/country.controller.mjs";
import * as cityController from "./controllers/city.controller.mjs";
import * as capitalController from "./controllers/capital.controller.mjs";
import * as urbanRuralController from "./controllers/urbanRural.controller.mjs";
import * as languageController from "./controllers/language.controller.mjs";

/* Create express instance */
const app = express();
const port = 3000;

/* Add form data middleware */
app.use(express.urlencoded({ extended: true }));

//Use the pug template engine
app.set("view engine", "pug");
app.set("views", "./views");

//Add a static files location
app.use(express.static("static"));

const db = await DatabaseService.connect();
const { conn } = db;



// Landing route
app.get("/", (req, res) => {
    res.redirect("/population");
});

// Route to handle population data
app.get("/population", async (req, res) => {
    // Extract parameters from request query
    const parameters = [
        req.query.continent,
        req.query.region,
        req.query.country,
        req.query.district,
        req.query.city
    ];

    // Replace null values with '%'
    for (let i = 0; i < parameters.length; i++) {
        if (parameters[i] === null || parameters[i]  === undefined) {
          parameters[i] = '%';
        }
    }

    // Check if city parameter is provided
    if(parameters[4] !== '%'){
        // Fetch city data from database
        const [rows, fields] = await db.getCityByName(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4]);

        // Format city data for Pug template
        const newList = rows.map(item => {
            return {
              string: `${item.Name}, ${item.Country}`,
              population: item.Population
            };
          });
        // Render Pug template with city data
        return res.render("population", {newList, currentRoute: "/population"});
    }

    // Fetch world population data
    const worldPopulation = await db.getWorldPopulation();
    console.log(worldPopulation);
    // Render Pug template with world population data
    return res.render("population", {newList: [{ string: `the World`, population: worldPopulation}], currentRoute: "/population"});
});

app.get("/capitals", capitalController.getCapitals);
app.get("/countries", countryController.getCountries);
app.get("/cities", cityController.getCities);
app.get("/urbanRural", urbanRuralController.getUrbanRuralPopulation);
app.get("/languages", languageController.getLanguages);

/* Authentication */

// Register
app.get("/register", (req, res) => {
    res.render("register");
});

// Login
app.get("/login", (req, res) => {
    res.render("login");
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
