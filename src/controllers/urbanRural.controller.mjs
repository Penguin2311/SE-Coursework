import { getUrbanVsRuralPopulation as continent} from "../models/continent.mjs";
import { getUrbanVsRuralPopulation as region} from "../models/region.mjs";
import { getUrbanVsRuralPopulation as country} from "../models/country.mjs";

export async function getUrbanRuralPopulation(req, res) {
    try {
        let heading = "Urban vs Rural Population in each continent";
        if (req.query.type === "region") {
            heading = "Urban vs Rural Population in each region";
        }
        if (req.query.type === "country") {
            heading = "Urban vs Rural Population in each country";
        }
        const type = req.query.type;
        let rows;
        if(req.query.type === "country") {
            rows = await country();
        }
        else if (req.query.type === "region") {
            rows = await region();
        }
        else {
            rows = await continent();
        }
        console.log(rows.length, "rows fetched");
        res.render("urbanRural", { rows, currentRoute: "/urbanRural", type, heading});
    } catch (err) {
        console.error("Error fetching urban vs rural population:", err.message);
        res.status(500).render('500');
    }
}