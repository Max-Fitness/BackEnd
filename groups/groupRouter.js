const express = require("express");

const Groups = require("./groupModel.js");
const regRestricted = require("../auth/regRestricted");
const empRestricted = require("../auth/empRestricted");
const adminRestricted = require("../auth/adminRestricted");
const nodemailer = require("nodemailer");
const router = express.Router();
const db = require("../knex/knex.js")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIN_EMAIL,
        pass: process.env.MAIN_PASSWORD
    }
})


router.get("/", regRestricted, (req, res)=>{
    Groups.getAllGroups()
    .then(gr=>{
        res.status(200).json(gr)
    })
})

router.get("/:id", regRestricted, (req, res)=>{
    Groups.findGroup(req.params.id)
    .then(gr=>{
        if(gr){
            res.status(200).json(gr)
        }
        else{
            res.status(404).json({error: "group with specified id does not exist"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "failed to retrieve group. please try again later"})
    })
})

router.post("/", empRestricted, (req, res)=>{
    if(isValidGroup(req.body)){
        Groups.insert(req.body)
        .then(gr=>{
            res.status(201).json(gr)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "failed to create new group"});
        })
    }
    else{
        res.status(400).json({error: "Group creation requires a title and a date"})
    }
})

router.put("/:id", empRestricted, (req, res)=>{
    Groups.findGroup(req.params.id)
    .then(gr=>{
        if(isValidGroup(req.body)){
            Groups.update(req.params.id, req.body)
            .then(grp=>{
                res.status(200).json(grp)
            })
            .catch(err=>{
                res.status(500).json({error: "failed to update group. please try again later"})
            })
        }
        else{
            res.status(400).json({error: "Groups require a title and a date"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json({error: "group with specified id does not exist"})
    })
})

router.put("/join/:id", regRestricted, (req, res)=>{
    const user = req.body;
    if(isValidUser(user)){
        fullName = user.fName + " " + user.lName + ""
        Groups.findGroup(req.params.id)
        .then(gr=>{
            let idsString = gr.regIds.split(",")
            let namesString = gr.regNames.split(",")
            const newIds = [];
            const newNames = []
            let addAtEnd = true;
            let sendSUemail = true;
            for(let i = 0; i < idsString.length; i++){
                if(parseInt(user.id, 10) != parseInt(idsString[i], 10)){
                    newNames.push(namesString[i]);
                    newIds.push(idsString[i]);
                }
                else{
                    addAtEnd = false;
                    sendSUemail = false;
                }
            }
            if(addAtEnd){
                newNames.push(fullName);
                newIds.push(user.id);
            }
            let newNameString = newNames.join(",");
            let newIdsString = newIds.join(",");

            let newGroup = {
                id: gr.id,
                title: gr.title,
                description: gr.description,
                date: gr.date,
                time: gr.time,
                employees: gr.employees,
                regNames: newNameString,
                regIds: newIdsString,
            }
            Groups.update(req.params.id, newGroup)
            .then(grp=>{
                let mailOptions = {
                    from: process.env.MAIN_EMAIL,
                    to: user.email,
                    subject: "Group Session Signup",
                    text: `Thank you for signing up for a group session, ${user.fName}!\n\nHere is a brief overview of your session:\n\n\n${grp.title}\n${grp.date} at ${grp.time} EST\n\n${grp.description}\n\nHosted by ${grp.employees}\n\n\n\nCan't wait to see you then!\n\n\n\n\n\nIf you would like to cancel your attendance to the group session, you can do so on the original page you filled out to sign up!` 
                }
                if(!sendSUemail){
                    mailOptions = {
                        from: process.env.MAIN_EMAIL,
                        to: user.email,
                        subject: "Group Session Cancellation",
                        text: `You have successfully cancelled your spot in the group session, ${user.fName}!\n\nHere is the session you cancelled, just in case it was in error:\n\n\n${grp.title}\n${grp.date} at ${grp.time}EST\n\n${grp.description}\n\nHosted by ${grp.employees}\n\n\n\nCan't wait to see you another time!\n\n\n\n\n\nIf you would like to reschedule your attendance to another group session, you can do so on the original page you filled out to sign up!` 
                    }
                }
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error)
                        res.status(500).json({error: "Something went wrong, please try again later!"})
                    }
                    else{
                        res.status(200).json(grp)
                    }
                })
            })
            .catch(err=>{
                res.status(500).json({error: "failed to update group. please try again later"})
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(404).json({error: "group with specified id does not exist"})
        })
    }
    else{
        res.status(400).json({error: "you must have a first name, last name, and id to join a group"})
    }
})

router.delete("/:id", empRestricted, (req, res)=>{
    Groups.remove(req.params.id)
    .then(gr=>{
        res.status(200).json(gr)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: "unable to delete group"})
    })
})

function isValidGroup(group){
    return Boolean(group.title, group.date)
}

function isValidUser(user){
    return Boolean(user.email, user.fName, user.lName, user.id)
}

module.exports = router;