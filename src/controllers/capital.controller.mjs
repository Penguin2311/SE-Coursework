import { getCapitalsByFilters } from '../models/city.mjs';

export async function getCapitals(req, res) {
    try {
        const filters = req.query;
        const rows = await getCapitalsByFilters(filters);
        console.log(rows.length, "capitals fetched");
        res.render("capitals", { rows, currentRoute: "/capitals" });
    } catch (err) {
        console.error("Error fetching capitals:", err.message);
        res.status(500).render('500');
    }
}