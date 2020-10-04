const db = require("../knex/knex.js");
module.exports={
    getAll,
    findPricing,
    insert,
    update,
    remove
}

function getAll(){
    return db("pricings");
}

function findPricing(id){
    return db("pricings").where({id}).first();
}

async function insert(group){
    try{
        const [id] = await db("pricings").insert(group, "id");
        
        return findPricing(id);
    }
    catch(err){
        throw err;
    }
}

function update(id, changes) {
    return db("pricings").where({id}).update(changes, "id")
    .then(updated=>{
        return db("pricings").where({id}).first();
    })
}

function remove(id){
    return db("pricings").where({id}).del()
    .then(res=>{
        return getAll();
    })
}

