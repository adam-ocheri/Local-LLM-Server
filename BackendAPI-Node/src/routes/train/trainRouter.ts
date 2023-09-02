import express from "express"
import { startTraining } from "../../controllers/train/trainController.js";

const trainRouter = express.Router();

trainRouter.route("/").post(startTraining)

export default trainRouter;