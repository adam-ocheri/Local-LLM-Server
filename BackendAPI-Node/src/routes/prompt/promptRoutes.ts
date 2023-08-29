import express from "express"
import { generateBasicPrompt, reloadSelectedModel } from "../../controllers/prompt/promptController.js";

const promptRouter = express.Router();

promptRouter.route("/").post(generateBasicPrompt);
promptRouter.route("/reload").post(reloadSelectedModel);
export default promptRouter;