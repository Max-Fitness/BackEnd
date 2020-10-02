const db = require("../data/dbConfig.js")

module.exports = {
    getAll,
    add,
    findById,
    findBy,
    update
}

function getAll(){
    return db("users");
}

async function add(user){
    try{
        const [id] = await db("users").insert(user, "id");
        return findById(id);
    }
    catch(error){
        throw error;
    }
}

function findById(id){
    return db("users").where({id}).first();
}

function findBy(filter) {
    return db("users").where(filter).orderBy("id");
  }

function update(id, changes) {
    return db("users").where({id}).update(changes, "id")
    .then(updated=>{
        return db("users").where({id}).first();
    })
}