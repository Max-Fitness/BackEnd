const db = require("../data/dbConfig.js");
module.exports={
    getAllGroups,
    findGroup,
    insert,
    update,
    remove
}

function getAllGroups(){
    return db("groups");
}

function findGroup(id){
    return db("groups").where({id}).first();
}

async function insert(group){
    try{
        const [id] = await db("groups").insert(group, "id");
        
        return findGroup(id);
    }
    catch(err){
        throw error;
    }
}

function update(id, changes) {
    return db("groups").where({id}).update(changes, "id")
    .then(updated=>{
        return db("groups").where({id}).first();
    })
}

function remove(id){
    return db("groups").where({id}).del()
    .then(res=>{
        return getAllGroups();
    })
}

