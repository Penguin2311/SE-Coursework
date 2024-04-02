export default class City {
    id;
    name;
    country;
    population;
    district;

    constructor(id, name, countryCode, district, population) {
        this.id = id;
        this.name = name;
        this.countryCode = countryCode;
        this.district = district;
        this.population = population;
    }
}
