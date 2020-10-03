require("dotenv").config();

const pgConnection = process.env.DATABASE_URL || "postgresql://postgres@localhost/auth";
// if using a local postgres server, please create the database manually, Knex will not create it autmatically

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : process.env.POSTGRES_USER,
      password : process.env.POSTGRES_PW,
      database : 'maxfitness',
      charset: 'utf8'
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: { 
      directory: __dirname + '/knex/seeds'
    },
  },
};
