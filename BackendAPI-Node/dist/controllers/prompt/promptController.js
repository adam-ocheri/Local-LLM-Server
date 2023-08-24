"use strict";
const generateBasicPrompt = async (req, res) => {
    try {
        const { modelName } = req.params;
        const { prompt } = req.body;
        res.json();
    }
    catch (error) {
        throw new Error(error);
    }
};
