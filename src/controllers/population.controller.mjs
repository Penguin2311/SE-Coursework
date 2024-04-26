import pool from '../services/db.connection.mjs';

export async function getPopulation(req, res) {
    let query;
    const param = req.query;
    try {
        // if city parameter is provided
        if (req.query.city) {
            query = `SELECT 
                        city.Name AS CityName,
                        district.Name AS DistrictName,
                        country.Name AS CountryName,
                        city.CountryCode,
                        city.Population AS CityPopulation
                    FROM city
                    JOIN district ON city.DistrictID = district.DistrictID
                    JOIN country ON city.CountryCode = country.CountryCode
                    WHERE 
                        country.Continent LIKE ? 
                        AND country.Region LIKE ? 
                        AND country.Name LIKE ? 
                        AND district.Name LIKE ? 
                        AND city.Name LIKE ?;`;
            
            let [rows] = await pool.query(query, [
                req.query.continent || '%',
                req.query.region || '%',
                req.query.country || '%',
                req.query.district || '%',
                req.query.city || '%'
            ]);

            rows = rows.map(item => {
                return {
                    string: `${item.CityName}, ${item.DistrictName}, ${item.CountryName}`,
                    population: item.CityPopulation
                };
            })
            console.log(rows.length, "rows fetched");
            res.render('population', { rows, param,  currentRoute: "/population" });
        } 

        // if district parameter is provided
        else if (req.query.district) {
            query = `SELECT 
                        district.Name AS DistrictName,
                        country.Name AS CountryName,
                        SUM(city.Population) AS DistrictPopulation
                    FROM city
                    JOIN district ON city.DistrictID = district.DistrictID
                    JOIN country ON district.CountryCode = country.CountryCode
                    WHERE 
                        country.Continent LIKE ? 
                        AND country.Region LIKE ? 
                        AND country.Name LIKE ? 
                        AND district.Name LIKE ?
                    GROUP BY 
                        district.DistrictID;`;

            let [rows] = await pool.query(query, [
                req.query.continent || '%',
                req.query.region || '%',
                req.query.country || '%',
                req.query.district || '%'
            ]);
            rows = rows.map(item => {
                return {
                    string: `${item.DistrictName}, ${item.CountryName}`,
                    population: item.DistrictPopulation
                };
            })
            console.log(rows.length, "rows fetched");
            res.render('population', { rows, param,  currentRoute: "/population" });
        }

        // if country parameter is provided
        else if (req.query.country) {
            query = `SELECT 
                        Name AS CountryName,
                        CountryCode,
                        country.Population AS CountryPopulation
                    FROM country
                    WHERE 
                        country.Continent LIKE ? 
                        AND country.Region LIKE ? 
                        AND (Name LIKE ? OR CountryCode LIKE ?);`;

            let [rows] = await pool.query(query, [
                req.query.continent || '%',
                req.query.region || '%',
                req.query.country || '%',
                req.query.country || '%'
            ]);
            rows = rows.map(item => {
                return {
                    string: `${item.CountryName} (${item.CountryCode})`,
                    population: item.CountryPopulation
                };
            })
            console.log(rows.length, "rows fetched");
            res.render('population', { rows, param,  currentRoute: "/population" });
        } 

        // if region parameter is provided
        else if (req.query.region) {
            query = `SELECT 
                        country.Region AS RegionName,
                        SUM(country.Population) AS RegionPopulation
                    FROM country
                    WHERE 
                        country.Continent LIKE ? 
                        AND country.Region LIKE ?
                    GROUP BY 
                        country.Region;`;

            let [rows] = await pool.query(query, [
                req.query.continent || '%',
                req.query.region || '%',
            ]);
            rows = rows.map(item => {
                return {
                    string: item.RegionName,
                    population: item.RegionPopulation
                };
            })
            console.log(rows.length, "rows fetched");
            res.render('population', { rows, param,  currentRoute: "/population" });
        } 
        
        // if continent parameter is provided
        else if (req.query.continent) {
            query = `SELECT 
                        country.Continent AS Name,
                        SUM(country.Population) AS Population
                    FROM country
                    WHERE 
                        country.Continent = ?
                    GROUP BY 
                        country.Continent;`;
            let [rows] = await pool.query(query, [
                req.query.continent,
            ]);
            rows = rows.map(item => {
                return {
                    string: item.Name,
                    population: item.Population
                };
            })
            console.log(rows.length, "rows fetched");
            res.render('population', { rows, param,  currentRoute: "/population" });
        } 
        
        // if no parameter is provided then fetch world population
        else {
            query = `SELECT 
                        SUM(Population) AS WorldPopulation
                    FROM country;`;
            let [rows] = await pool.query(query);
            rows = rows.map(item => {
                return {
                    string: `the World`,
                    population: item.WorldPopulation
                };
            })
            console.log(rows.length, "rows fetched");
            res.render('population', { rows, param,  currentRoute: "/population" });
        }
    } catch (err) {
        console.error("Error fetching population:", err.message);
        res.status(500).render('500');
    }
}                
