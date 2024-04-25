import { getCountriesByFilters } from '../models/country.mjs';

export async function getCountries(req, res) {
    try {
        const filters = req.query;
        const rows = await getCountriesByFilters(filters);
        console.log(rows.length, "countries fetched");
        res.render("countries", { rows, currentRoute: "/countries" });
    } catch (err) {
        console.error("Error fetching countries:", err.message);
        res.status(500).render('500');
    }
}