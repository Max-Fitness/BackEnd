const express = require("express");

const Site = require("./siteInfoModel.js");
const adminRestricted = require("../auth/adminRestricted")
const router = express.Router();
const db = require("../knex/knex.js");


router.get("/", (req, res)=>{
    Site.getArr()
    .then(inf=>{
        res.status(200).json(inf)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "Unable to get site info, please try again later!"})
    })
})


router.get("/:id", (req, res)=>{
    Site.getInfo(req.params.id)
    .then(inf=>{
        res.status(200).json(inf)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "Could not get the information"})
    })
})

router.post("/", (req, res)=>{
    Site.insert(req.body)
    .then(inf=>{
        res.status(201).json(inf)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "could not create info"})
    })
})

router.put("/:id", adminRestricted, (req, res)=>{
    Site.update(req.params.id, req.body)
    .then(inf=>{
        res.status(200).json(inf)
    })
    .catch(err=>{
        res.status(500).json(err)
    })
})

module.exports = router;