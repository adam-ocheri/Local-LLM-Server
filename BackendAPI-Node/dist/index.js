// const express = require("express");
import express from "express";
const server = express();
server.use("/", (req, res) => {
    res.json("HF Runtime Containers - Backend API service : Operational");
});
server.listen(4000, () => {
    console.log("server is listening on port 4000");
});
