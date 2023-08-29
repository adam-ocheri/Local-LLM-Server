export interface IHFModel {
    provider: string;
    availableModels: string[];
}

const metaLlamaProvider : IHFModel = {
    provider : 'meta-llama',
    availableModels : [
        "Llama-2-7b-hf",
        "Llama-2-13b-hf",
        "Llama-2-70b-hf"
    ]
}
const theBlokeProvider : IHFModel = {
    provider : 'the-Bloke',
    availableModels : [
        "cookie",
        "shmerkler",
    ]
}

export const providersList : IHFModel[] = [metaLlamaProvider, theBlokeProvider]