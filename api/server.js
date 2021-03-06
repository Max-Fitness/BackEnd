const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("../auth/authRouter.js");
const userRouter = require("../users/userRouter.js");
const groupRouter = require("../groups/groupRouter.js")
const infoRouter = require("../siteInfo/siteInfoRouter.js")
const priceRouter = require("../pricing/pricingRouter.js")

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api", authRouter);
server.use("/api/users", userRouter);
server.use("/api/groups", groupRouter);
server.use("/info", infoRouter)
server.use("/pricing", priceRouter)

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = server;
