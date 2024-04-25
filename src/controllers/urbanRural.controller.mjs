import { getUrbanVsRuralPopulation as continent} from "../models/continent.mjs";

export async function getUrbanRuralPopulation(req, res) {
    try {
        const rows = await continent();
        console.log(rows.length, "rows fetched");
        res.render("urbanRural", { rows, currentRoute: "/urbanRural" });
    } catch (err) {
        console.error("Error fetching urban vs rural population:", err.message);
        res.status(500).render('500');
    }
}