import pool from '../services/db.connection.mjs';

export async function getLanguages(req, res) {
    const query = `SELECT 
                    Language,
                    SUM(CountryPopulation * (Percentage / 100)) AS TotalSpeakers,
                    (SUM(CountryPopulation * (Percentage / 100)) / (SELECT SUM(Population) FROM country)) * 100 AS PercentageOfWorldPopulation
                FROM 
                    countrylanguage cl
                JOIN 
                    (SELECT CountryCode, Population AS CountryPopulation FROM country) c ON cl.CountryCode = c.CountryCode
                WHERE 
                    Language IN ('Chinese', 'English', 'Hindi', 'Spanish', 'Arabic')
                GROUP BY 
                    Language
                ORDER BY 
                    TotalSpeakers DESC;`;
    try {
        const [rows] = await pool.query(query);
        console.log(rows.length, "rows fetched");
            res.render('languages', {rows, currentRoute: "/languages"});
        
    } catch (err) {
        console.error("Error fetching languages:", err.message);
        res.status(500).render('500');
    }
}