export async function generateBasicPrompt(req, res) {
    try {
        const { modelName } = req.params;
        const { prompt } = req.body;
        res.json(`Hello Response! | ${modelName} | ${prompt}`);
    }
    catch (error) {
        throw new Error(error);
    }
}
