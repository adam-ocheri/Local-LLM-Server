import express from "express"
import { preprocessCsv, verifyDataset } from "../../controllers/finetune/finetuneController.js";


const tuneRouter = express.Router();

tuneRouter.route("/")
.get(verifyDataset)
.post(preprocessCsv)

export default tuneRouter;