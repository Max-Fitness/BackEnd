
exports.up = function(knex) {
    return knex.schema.createTable("groupsessions", group=>{
      group.increments();
      group.string("title").notNullable();
      group.string("description");
      group.string("date");
      group.string("time");
      group.string("employees");
      group.string("regNames");
      group.string("regIds");
    })
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("groupsessions")
  };
  