import mysql from "mysql2/promise";
import City from "../models/city.mjs";
import Country from "../models/country.mjs";

export default class DatabaseService {
    conn;

    constructor(conn) {
        this.conn = conn;
    }

    /* Establish database connection and return the instance */
    static async connect() {
        const conn = await mysql.createConnection({
            host: process.env.DATABASE_HOST || "localhost",
            user: "user",
            password: "password",
            database: "world",
        });

        return new DatabaseService(conn);
    }

    
    async getWorldPopulation() {
        const [rows, fields] = await this.conn.execute('SELECT SUM(Population) AS worldPopulation FROM country;');
        const worldPopulation = rows[0].worldPopulation;
        const worldPopulationInt = parseInt(worldPopulation, 10);
        return worldPopulationInt;
    }

    /* Get a list of countries */
    async getCountries() {
        const sql = `SELECT c.CountryCode,
                            c.Name,
                            c.Continent,
                            c.Region,
                            c.Population,
                    COALESCE(ct.Name, 'No Capital') AS Capital -- Use COALESCE to handle NULL capital IDs
                    FROM country c
                    LEFT JOIN city ct ON c.Capital = ct.CityID
                    ORDER BY c.Population DESC;`;
        const countries = await this.conn.execute(sql);
        return countries;
    }

    /* Get a list of all cities */
    async getCities() {
        const sql = `SELECT city.Name AS Name, 
                            country.Name AS Country, 
                            district.Name as District, 
                            city.Population 
                     FROM city 
                     JOIN country ON city.CountryCode = country.CountryCode 
                     JOIN district ON city.DistrictID = district.DistrictID 
                     ORDER BY city.Population DESC;`;
        const cities = await this.conn.execute(sql);
        return cities;
    }

    /* Get city by Name, District, country, region, continent */
    async getCityByName(continent, region, country, district, city) {
        const sql = `SELECT city.Name AS Name,
                            country.Name AS Country,
                            district.Name as District,
                            city.Population,
                            country.Region,
                            country.Continent
                    FROM city
                    JOIN district ON city.DistrictID = district.DistrictID
                    JOIN country ON city.CountryCOde = country.CountryCode 
                    where 
                        country.Continent like "${continent}" and
                        country.Region like "${region}" and
                        country.Name like "${country}" and
                        district.Name like "${district}" and
                        city.Name like "${city}";`
        const data = await this.conn.execute(sql);
        return data;
    }

    /* Get a particular city by ID, including country information */
    async getCity(cityId) {
        const sql = `
        SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.Population as CountryPopulation
        FROM city
        INNER JOIN country ON country.Code = city.CountryCode
        WHERE city.ID = ${cityId}
    `;
        const [rows, fields] = await this.conn.execute(sql);
        /* Get the first result of the query (we're looking up the city by ID, which should be unique) */
        const data = rows[0];
        const city = new City(
            data.ID,
            data.Name,
            data.CountryCode,
            data.District,
            data.Population
        );
        const country = new Country(
            data.Code,
            data.Country,
            data.Continent,
            data.Region,
            data.CountryPopulation
        );
        city.country = country;
        return city;
    }

    /* Delete a city by ID */
    async removeCity(cityId) {
        const res = await this.conn.execute(
            `DELETE FROM city WHERE id = ${cityId}`
        );
        console.log(res);
        return res;
    }

    /* Get a list of countries */
    async getCountries() {
        const sql = `SELECT * FROM country`;
        const [rows, fields] = await this.conn.execute(sql);
        const countries = rows.map(c => new Country(c.Code, c.Name, c.Continent, c.Region, c.Population));
        return countries;
    }
}
