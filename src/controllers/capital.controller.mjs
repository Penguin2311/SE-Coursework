import { getCapitalsByFilters } from '../models/city.mjs';

export async function getCapitals(req, res) {
    try {
        let heading = "Capital Cities in the World from largest to smallest population:";
        if (req.query.continent) {
            heading = `Capital Cities in ${req.query.continent} from largest to smallest population:`;
        }
        if (req.query.region) {
            heading = `Capital Cities in ${req.query.region} from largest to smallest population:`;
        }
        if (req.query.topN) {
            heading = `Top ${req.query.topN} `+ heading;
        } else {
            heading = "All " + heading;
        }
        const filters = req.query;
        const rows = await getCapitalsByFilters(filters);
        console.log(rows.length, "capitals fetched");
        res.render("capitals", { rows, currentRoute: "/capitals", heading });
    } catch (err) {
        console.error("Error fetching capitals:", err.message);
        res.status(500).render('500');
    }
}