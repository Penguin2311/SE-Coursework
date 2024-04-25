import pool from "../services/db.connection.mjs";

// Function to get a list of all countries based on query parameters
export async function getCountries(req, res) {
    let query = `SELECT c.CountryCode,
                        c.Name,
                        c.Continent,
                        c.Region,
                        c.Population,
                COALESCE(ct.Name, 'No Capital') AS Capital -- Use COALESCE to handle NULL capital IDs
                FROM country c
                LEFT JOIN city ct ON c.Capital = ct.CityID
                WHERE 1=1`; // base query
    
    // Check for query parameters and append to the query as needed
    if (req.query.continent) {
        query += ` AND c.continent = '${req.query.continent}'`;
    }
    if (req.query.region) {
        query += ` AND c.region = '${req.query.region}'`;
    }
    // If limit is provided, add it to the query otherwise just order by population
    if (req.query.topN) {
        query += ` ORDER BY c.Population DESC LIMIT ${req.query.topN};`; 
    } else {
        query += ` ORDER BY c.Population DESC;`;
    }

    try {
        const [rows] = await pool.query(query);
        console.log(rows.length, "countries fetched");
        res.render("countries", { rows, currentRoute: "/countries" });
        
    } catch (err) {
        console.error("Error fetching countries:", err.message);
        res.status(500).render('500');
    }
}