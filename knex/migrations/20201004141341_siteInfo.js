
exports.up = function(knex) {
    return knex.schema.createTable("siteInfo", site=>{
      site.increments();
      site.string("introTitle", 1000).notNullable();
      site.string("introText", 10000).notNullable();
      site.string("introSubTitleA", 1000).notNullable();
      site.string("introSubTextA", 10000).notNullable();
      site.string("introSubTitleB", 1000).notNullable();
      site.string("introSubTextB", 10000 ).notNullable();
      site.string("groupTitle", 1000).notNullable();
      site.string("groupText", 10000).notNullable();
      site.string("contactPhone");
      site.string("contactTwitter");
      site.string("contactAddress");
      site.string("contactFacebook");
      site.string("contactYoutube");
      site.string("contactInstagram");
      site.string("linkedIn");
      site.string("youtube");

    })
  };
  
  exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("siteInfo")
  };
  