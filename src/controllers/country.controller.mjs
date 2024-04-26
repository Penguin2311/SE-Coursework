import { getCountriesByFilters } from '../models/country.mjs';

export async function getCountries(req, res) {
    try {
        let heading = "Countries in the World from largest to smallest population:";
        if (req.query.continent) {
            heading = `Countries in ${req.query.continent} from largest to smallest population:`;
        }
        if (req.query.region) {
            heading = `Countries in ${req.query.region} from largest to smallest population:`;
        }
        if (req.query.topN) {
            heading = `Top ${req.query.topN} `+ heading;
        } else {
            heading = "All " + heading;
        }

        let filters = req.query;
        filters.topN = parseInt(req.query.topN);
        const rows = await getCountriesByFilters(filters);
        console.log(rows.length, "countries fetched");
        res.render("countries", { rows, currentRoute: "/countries", heading });
    } catch (err) {
        console.error("Error fetching countries:", err.message);
        res.status(500).render('500');
    }
}