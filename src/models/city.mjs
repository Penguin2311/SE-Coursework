import pool from '../services/db.connection.mjs';

export default class City {
    id;
    name;
    country;
    population;
    district;

    constructor(id, name, countryCode, district, population) {
        this.id = id;
        this.name = name;
        this.countryCode = countryCode;
        this.district = district;
        this.population = population;
    }
}

export async function getCitiesByFilters(filters) {
    let query = `SELECT city.Name AS Name, 
                    country.Name AS Country, 
                    district.Name as District, 
                    city.Population 
                FROM city 
                JOIN country ON city.CountryCode = country.CountryCode 
                JOIN district ON city.DistrictID = district.DistrictID
                WHERE 1=1`; // base query

    // Construct the query based on the provided filters
    if (filters.continent) {
        query += ` AND country.continent = ?`;
    }
    if (filters.region) {
        query += ` AND country.region = ?`;
    }
    if (filters.country) {
        query += ` AND country.CountryCode = ?`;
    }
    if (filters.district) {
        query += ` AND district.DistrictID = ?`;
    }
    if (filters.topN) {
        query += ` ORDER BY city.Population DESC LIMIT ?`;
    } else {
        query += ` ORDER BY city.Population DESC`;
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

export async function getCapitalsByFilters(filters) {
    let query = `SELECT city.Name AS Name, 
                    country.Name AS Country, 
                    city.Population
                FROM city
                INNER JOIN country ON city.CityID = country.Capital
                WHERE 1=1`; // base query

    // Construct the query based on the provided filters
    if (filters.continent) {
        query += ` AND country.continent = ?`;
    }
    if (filters.region) {
        query += ` AND country.region = ?`;
    }
    if (filters.country) {
        query += ` AND country.CountryCode = ?`;
    }
    // if limit is provided, limit the results otherwise just order by population
    if (filters.topN) {
        query += ` ORDER BY city.Population DESC LIMIT ?`;
    } else {
        query += ` ORDER BY city.Population DESC`;
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