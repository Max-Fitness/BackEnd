const router = require("express").Router();

const Users = require("./userModel.js");
const adminRestricted = require("../auth/adminRestricted.js");
const empRestricted = require("../auth/empRestricted.js");


router.get("/", adminRestricted, (req, res)=>{
    Users.getAll()
    .then(users=>{
        res.status(200).json(users);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "could not load users"})
    })
})

router.get("/:id", adminRestricted, (req, res)=>{
    Users.findById(req.params.id)
    .then(user=>{
        if(user){
            res.status(200).json(user)
        }
        else{
            res.status(404).json({error: "user not found"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "unable to find user"})
    })
})

router.put("/:id", adminRestricted, (req, res)=>{
    Users.findById(req.params.id)
    .then(user=>{
        if(user){
            let newRole = user.role;
            if(req.body.role === "admin"){
                newRole = 4
            }
            else if (req.body.role === "employee"){
                newRole = 3
            }
            else if (req.body.role === "member"){
                newRole = 2
            }
            else if (req.body.role === "non-member"){
                newRole = 1
            }
            let newUser = {
                email: user.email,
                fName: user.fName,
                lName: user.lName,
                password: user.password,
                role: newRole
            }
            Users.update(req.params.id, newUser)
            .then(usr=>{
                res.status(200).json({user: usr})
            })
            .catch(err=>{
                res.status(500).json({error: "failed to promote user"})
            })
        }
        else{
            res.status(404).json({error: "user not found"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "something went wrong. please try again later"})
    })
})

router.get("/employees", (req, res)=>{
    Users.getAll()
    .then(users=>{
        res.status(200).json(users);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "could not load users"})
    })
})


module.exports = router;