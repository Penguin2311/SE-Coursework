import pool from '../services/db.connection.mjs';

export default class District {
    name;

    constructor(name) {
        this.name = name;
    }
}