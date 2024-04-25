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
                    SUM(total_population) AS Population,
                    SUM(city_population) AS city_population,
                    SUM(total_population - city_population) AS rural_population,
                    SUM(city_population) / SUM(total_population) * 100 AS city_percentage,
                    SUM(total_population - city_population) / SUM(total_population) * 100 AS rural_percentage
                FROM (
                    SELECT 
                        c.region AS region,
                        SUM(c.Population) AS total_population,
                        COALESCE(SUM(ci.Population), 0) AS city_population
                    FROM country c
                    LEFT JOIN city ci ON c.CountryCode = ci.CountryCode
                    GROUP BY c.region
                ) AS region_population
            GROUP BY region;`;

    try {
        const [rows] = await pool.query(query);
        return rows;
    } catch (err) {
        throw err;
    }
}