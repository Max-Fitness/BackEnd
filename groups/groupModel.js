const db = require("../knex/knex.js");
module.exports={
    getAllGroups,
    findGroup,
    insert,
    update,
    remove
}

function getAllGroups(){
    return db("groupsessions");
}

function findGroup(id){
    return db("groupsessions").where({id}).first();
}

async function insert(group){
    try{
        const [id] = await db("groupsessions").insert(group, "id");
        
        return findGroup(id);
    }
    catch(err){
        throw error;
    }
}

function update(id, changes) {
    return db("groupsessions").where({id}).update(changes, "id")
    .then(updated=>{
        return db("groupsessions").where({id}).first();
    })
}

function remove(id){
    return db("groupsessions").where({id}).del()
    .then(res=>{
        return getAllGroups();
    })
}

