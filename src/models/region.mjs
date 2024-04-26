import pool from '../services/db.connection.mjs';

export default class Region {
    name;

    constructor(name) {
        this.name = name;
    }
}

// function to get urban vs rural population
export async function getUrbanVsRuralPopulation() {
    let query = `SELECT 
    region as Name,
    SUM(country_population) AS Population,
    SUM(city_population) AS city_population,
    SUM(country_population - city_population) AS rural_population,
    SUM(city_population) / SUM(country_population) * 100 AS city_percentage,
    SUM(country_population - city_population) / SUM(country_population) * 100 AS rural_percentage
FROM (
    SELECT 
        c.region AS region,
        c.Population AS country_population,
        SUM(ci.Population) AS city_population
    FROM country c
    LEFT JOIN city ci ON c.CountryCode = ci.CountryCode
    GROUP BY c.CountryCode
) AS region_population
GROUP BY region;`;
    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (err) {
        throw err;
    }
}