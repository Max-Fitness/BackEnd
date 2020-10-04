const router = require("express").Router();

const Price = require("./pricingModel.js");
const adminRestricted = require("../auth/adminRestricted.js");

router.get("/", (req,res)=>{
    Price.getAll()
    .then(pr=>{
        res.status(200).json(pr)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "Could not load prices"})
    })
})

router.get("/:id", (req, res)=>{
    Price.findPricing(req.params.id)
    .then(pr=>{
        if(pr){
            res.status(200).json(pr)
        }
        else{
            res.status(404).json({error: "Price with specified ID does not exist"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "Could not load price"})
    })
})

router.post('/', adminRestricted, (req, res)=>{
    if(isValidPricing(req.body)){
        Price.insert(req.body)
        .then(pr=>{
            res.status(201).json(pr)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "Could not create new price"})
        })
    }
    else{
        res.status(400).json({error: "Price creation requires a title, description, and price"})
    }
})

router.put("/:id", adminRestricted, (req, res)=>{
    Price.findPricing(req.params.id)
    .then(pr=>{
        if(isValidPricing(req.body)){
            Price.update(req.params.id, req.body)
            .then(pr=>{
                res.status(200).json(pr)
            })
            .catch(err=>{
                console.log(err)
                res.status(500).json({error: "could not update price"})
            })
        }
        else{
            res.status(400).json({error: "pricing requires a title, description, and price"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(404).json({error: "Price with specified ID does not exist"})
    })
})

router.delete("/:id", adminRestricted, (req, res)=>{
    Price.remove(req.params.id)
    .then(pr=>{
        res.status(200).json(pr)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "could not delete price"})
    })
})

function isValidPricing(pr){
    return Boolean(pr.title, pr.description, pr.price)
}

module.exports = router;