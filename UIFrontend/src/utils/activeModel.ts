export default class ActiveModel {
    private _provider: string;
    private _model: string;
  
    constructor(providerName: string, modelName: string) {
      this._provider = providerName;
      this._model = modelName;
    }
  
    get provider(): string {
      return this._provider;
    }
  
    set provider(newProvider: string) {
      this._provider = newProvider;
    }
  
    get model(): string {
      return this._model;
    }
  
    set model(newModel: string) {
      this._model = newModel;
    }
  
    getProvider(): string {
      return this._provider;
    }
  
    getModel(): string {
      return this._model;
    }
}

// class ActiveModel  {
//     provider: string;
//     model: string;
//     constructor(providerName : string, modelName: string) {
//       this.provider = providerName;
//       this.model = modelName;
//     }
    
//     getProvider() : string {
//       return this.provider;
//     }

//     getModel() : string {
//         return this.model;
//     }
// } 