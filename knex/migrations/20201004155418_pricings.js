
exports.up = function(knex) {
    return knex.schema.createTable("pricings", price=>{
      price.increments();
      price.string("title", 1000).notNullable();
      price.string("description", 10000).notNullable();
      price.string("price", 1000).notNullable();
    })
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("pricings")
  };
  