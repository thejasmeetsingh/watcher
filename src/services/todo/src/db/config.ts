import knex from "knex";
import config from "@db/knexfile";

export const db = knex(config["development"]);
