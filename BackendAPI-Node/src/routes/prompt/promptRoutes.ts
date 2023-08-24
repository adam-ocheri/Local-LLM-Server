import express from "express"
import { generateBasicPrompt } from "../../controllers/prompt/promptController.js";

const promptRouter = express.Router();

promptRouter.route("/").post(generateBasicPrompt)

export default promptRouter;