export class ConfigValidator {
    static validate(config: any) {
      if (!config.apiId || !config.apiHash) {
        throw new Error('API ID and Hash must be set in the configuration.');
      }
    }
  }