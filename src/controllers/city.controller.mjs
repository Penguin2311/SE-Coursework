import pool from "../services/db.connection.mjs";

// Function to get a list of all cities based on query parameters
export async function getCities(req, res) {
    let query = `SELECT city.Name AS Name, 
                    country.Name AS Country, 
                    district.Name as District, 
                    city.Population 
                FROM city 
                JOIN country ON city.CountryCode = country.CountryCode 
                JOIN district ON city.DistrictID = district.DistrictID
                WHERE 1=1`; // base query
    
    // Check for query parameters and append to the query as needed
    if (req.query.continent) {
        query += ` AND country.continent = '${req.query.continent}'`;
    }
    if (req.query.region) {
        query += ` AND country.region = '${req.query.region}'`;
    }
    if (req.query.country) {
        query += ` AND country.CountryCode = '${req.query.country}'`;
    }
    if (req.query.district) {
        query += ` AND district.DistrictID = '${req.query.district}'`;
    }
    if (req.query.topN) {
        query += ` ORDER BY city.Population DESC LIMIT ${req.query.topN};`;
    } else {
        query += ` ORDER BY city.Population DESC;`;
    }

    try {
        const [rows] = await pool.query(query);
        console.log(rows.length, "cities fetched");
        res.render("cities", { rows, currentRoute: "/cities" });;
        
    } catch (err) {
        console.error("Error fetching cities:", err.message);
        res.status(500).render('500');
    }
}