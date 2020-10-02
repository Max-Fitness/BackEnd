const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = require("express").Router();

const Users = require("../users/userModel.js")
const secrets = require("../config/secrets.js")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIN_EMAIL,
        pass: process.env.MAIN_PASSWORD
    }
})



router.post("/register", (req, res)=>{
    const credentials = req.body;
    const userEmail = credentials.email;
    const userPass = credentials.password;

    if(isValid(credentials) && req.body.role <= 2){
        const mailOptions = {
            from: process.env.MAIN_EMAIL,
            to: userEmail,
            subject: "Welcome to Max Fitness!",
            text: `Welcome to Max Fitness, ${credentials.fName}! \nHere's your login information:\n \nEmail Address: ${userEmail}\nPassword: ${userPass}` 
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
                res.status(500).json({error: "Something went wrong, please try again later!"})
            }
            else{
                const rounds = process.env.BCRYPT_ROUNDS || 8;
                const hash = bcryptjs.hashSync(credentials.password, rounds);
                credentials.password = hash;
                Users.add(credentials)
                .then(user=>{
                    res.status(201).json({data: user});
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500).json({error: "could not register user, email might already be taken"})
                })
            }
        })
    }
    else{
        res.status(400).json({error: "registration requires an email and a password"})
    }
})

router.post("/login", (req, res)=>{
    const {email, password} = req.body;
    console.log(req.body)
    if(email && password){
        console.log("u/p valid")
        Users.findBy({email: email})
        .then(([user])=>{
            if(user && bcryptjs.compareSync(password, user.password)) {
                const token = generateToken(user);
                const retUser = {
                    id: user.id,
                    fName: user.fName,
                    lName: user.lName,
                    email: user.email,
                    role: user.role,
                }
                res.status(200).json({user: retUser, token})
            }
            else{
                res.status(401).json({error: "invalid credentials"})
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({error: "unable to log in"})
        })
    }
    else{
        res.status(400).json({error: "login requires an email and a password"})
    }
})

function generateToken(user) {
    const payload = {
      subject: user.id, 
      email: user.email,
      role: user.role,
    };
  
    const options = {
      expiresIn: '7300d', 
    };
    return jwt.sign(payload, secrets.jwtSecret, options);
  }
  

function isValid(user) {
    return Boolean(user.email && user.fName && user.lName && user.password && typeof user.password === "string" && user.role);
  }

  module.exports = router;