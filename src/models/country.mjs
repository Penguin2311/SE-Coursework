import pool from '../services/db.connection.mjs';

export default class Country { // class to represent a Country
    code;
    name;
    continent;
    region;
    population;
    capital;

    constructor(code, name, continent, region, population, capital) {
        this.code = code;
        this.name = name;
        this.continent = continent;
        this.region = region;
        this.population = population;
        this.capital = capital;
    }
}

export async function getCountriesByFilters(filters) {
    let query = `SELECT c.CountryCode,
                        c.Name,
                        c.Continent,
                        c.Region,
                        c.Population,
                COALESCE(ct.Name, 'No Capital') AS Capital -- Use COALESCE to handle NULL capital IDs
                FROM country c
                LEFT JOIN city ct ON c.Capital = ct.CityID
                WHERE 1=1`; // base query

    // Construct the query based on the provided filters
    if (filters.continent) {
        query += ` AND c.continent = ?`;
    }
    if (filters.region) {
        query += ` AND c.region = ?`;
    }
    // If limit is provided, add it to the query otherwise just order by population
    if (filters.topN) {
        query += ` ORDER BY c.Population DESC LIMIT ?`;
    } else {
        query += ` ORDER BY c.Population DESC`;
    }

    // Execute the query with parameters
    const queryParams = Object.values(filters); // Extract values of filter object
    try {
        const [rows] = await pool.query(query, queryParams);
        return rows;
    } catch (err) {
        throw err;
    }
}

export async function getUrbanVsRuralPopulation() {
    let query = `SELECT 
                    country.Name AS Name,
                    country.Population AS Population,
                    SUM(city.Population) AS city_population,
                    country.Population - SUM(city.Population) AS rural_population,
                    SUM(city.Population) / country.Population * 100 AS city_percentage,
                    (1 - SUM(city.Population) / country.Population) * 100 AS rural_percentage
                FROM country
                LEFT JOIN city ON country.CountryCode = city.CountryCode
                GROUP BY country.CountryCode;`;

    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (err) {
        throw err;
    }
}