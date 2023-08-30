import express from "express";
import { triggerTrainingFromCSV } from "../../controllers/finetune/finetuneController.js";
const tuneRouter = express.Router();
tuneRouter.route("/").post(triggerTrainingFromCSV);
export default tuneRouter;
