import { getEnvironment, Environment } from '../config/environments';

export class EnvironmentHelper {
  private static instance: EnvironmentHelper;
  private currentEnvironment: Environment;

  private constructor() {
    const env = process.env.ENVIRONMENT || 'qa1';
    this.currentEnvironment = getEnvironment(env);
  }

  public static getInstance(): EnvironmentHelper {
    if (!EnvironmentHelper.instance) {
      EnvironmentHelper.instance = new EnvironmentHelper();
    }
    return EnvironmentHelper.instance;
  }

  public getCurrentEnvironment(): Environment {
    return this.currentEnvironment;
  }

  public getBaseUrl(): string {
    return this.currentEnvironment.baseUrl;
  }

  public getTimeout(): number {
    return this.currentEnvironment.timeout;
  }

  public getRetries(): number {
    return this.currentEnvironment.retries;
  }

  public isHeadless(): boolean {
    return this.currentEnvironment.headless;
  }

  public getSlowMo(): number {
    return this.currentEnvironment.slowMo || 0;
  }

  public getEnvironmentName(): string {
    return this.currentEnvironment.name;
  }

  public getDataDriver(): string {
    return this.currentEnvironment.dataDriver;
  }
}

// Export singleton instance
export const envHelper = EnvironmentHelper.getInstance();