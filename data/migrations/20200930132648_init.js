
exports.up = function(knex) {
    return knex.schema.createTable("users", user=>{
        user.increments();
        user.string("email").notNullable().unique();
        user.string("fName").notNullable();
        user.string("lName").notNullable();
        user.string("password").notNullable();
        user.integer("role").notNullable();
    })
    .createTable("groups", group=>{
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
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users")
  };
  