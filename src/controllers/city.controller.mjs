import { getCitiesByFilters } from '../models/city.mjs';

// function to get cities from model and render the cities view
export async function getCities(req, res) {
    try {
        const filters = req.query;
        const rows = await getCitiesByFilters(filters);
        console.log(rows.length, "cities fetched");
        res.render("cities", { rows, currentRoute: "/cities" });
    } catch (err) {
        console.error("Error fetching cities:", err.message);
        res.status(500).render('500');
    }
}