export interface Environment{
    name: string,
    dataDriver: string,
    baseUrl: string,
    timeout: number,
    retries: number,
    headless: boolean,
    slowMo?: number
}

/**
 * Define test environments and attributes
 */

export const environments: Record<string, Environment> = {
    qa: {
        name: 'https://playwright.dev/',
        dataDriver: '',
        baseUrl: '',
        timeout: 50000,
        retries: 1,
        headless: true,
        slowMo: 0
    },
    uat: {
        name: 'https://playwright.dev/',
        dataDriver: '',
        baseUrl: '',
        timeout: 50000,
        retries: 1,
        headless: true,
        slowMo: 0
    }
};

export function getEnvironment(env: string = 'qa'): Environment {
    const environment = environments[env.toLocaleLowerCase()];
    if(!environment){
        throw new Error(`Environment '${env}' not found. Available environments: ${Object.keys(environments).join(',')}`);
    }
    return environment;
}

