const db = require("../knex/knex.js")

module.exports = {
    getArr,
    insert,
    getInfo,
    update,
}

function getArr(){
    return db("siteInfo");
}

async function insert(inf){
    try{
        const [id] = await db("siteInfo").insert(inf, "id");
        
        return getInfo(id);
    }
    catch(err){
        throw err;
    }
}

function getInfo(id){
    return db("siteInfo").where({id}).first();
}

function update(id, changes) {
    return db("siteInfo").where({id}).update(changes, "id")
    .then(updated=>{
        return db("siteInfo").where({id}).first();
    })
}
