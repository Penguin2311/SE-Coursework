import { getCitiesByFilters } from '../models/city.mjs';

// function to get cities from model and render the cities view
export async function getCities(req, res) {
    try {
        let heading = "Cities in the World from largest to smallest population:";
        if (req.query.continent) {
            heading = `Cities in ${req.query.continent} from largest to smallest population:`;
        }
        if (req.query.region) {
            heading = `Cities in ${req.query.region} from largest to smallest population:`;
        }
        if (req.query.country) {
            heading = `Cities in ${req.query.country} from largest to smallest population:`;
        }
        if (req.query.district) {
            heading = `Cities in ${req.query.district} from largest to smallest population:`;
        }
        if (req.query.topN) {
            heading = `Top ${req.query.topN} `+ heading;
        } else {
            heading = "All " + heading;
        }
        const filters = req.query;
        const rows = await getCitiesByFilters(filters);
        console.log(rows.length, "cities fetched");
        res.render("cities", { rows, currentRoute: "/cities", heading });
    } catch (err) {
        console.error("Error fetching cities:", err.message);
        res.status(500).render('500');
    }
}