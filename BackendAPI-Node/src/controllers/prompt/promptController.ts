
export async function generateBasicPrompt(req : any, res : any)  {
    try {
        const {modelName} = req.params;
        const {prompt} = req.body;
        res.json(`Hello Response! | ${modelName} | ${prompt}`)
    } catch (error : any) {
        throw new Error(error)
    }
}