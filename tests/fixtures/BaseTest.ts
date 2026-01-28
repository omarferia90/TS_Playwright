import { test as base, type TestInfo } from "@playwright/test";
import { ConsoleLogger } from '../../utils/console-logger';
//import { LoginPage } from "../pages/LoginPage";


//Fixtures to define each POM
type MyFixtures = {
    tearDown: void;
    timeLogger: void;
    exceptionLogger: void;
    testInfo: TestInfo;
    consoleLogger: ConsoleLogger;
};

export const test = base.extend<MyFixtures>({
    page: async ({ page }, use)=> {
        try{ 
            //Before each test case
            await use(page); 
            //After each test case
        }
        finally{
            //Finally each test
            await page.close();
        }
    },
    testInfo: [async({}, use, testInfo) => {
        await use(testInfo);
    }, { auto: true }],
    timeLogger: [async({}, use, testInfo) => {
        const startTime = new Date();
        testInfo.annotations.push({ type: "Start", description: formatDate(startTime) });
        await use();
        const endTime = new Date();
        testInfo.annotations.push({ type: "End", description: formatDate(endTime) });
        // Calculate Time
        const duration = (endTime.getTime() - startTime.getTime()) / 1000; // Segundos
        const minutes = Math.floor(duration / 60);
        const seconds = Math.round(duration % 60);
        testInfo.annotations.push({ type: "Duration", description: `${minutes}m ${seconds}s` });
    }, 
    { auto: true }],
    //login: async ({ page }, use) => {
    //    await use(new LoginPage(page));
    //},
    consoleLogger: async ({ page }, use) => {
        await use(new ConsoleLogger(page));
    }
});

export { expect } from "@playwright/test";

export function step(stepName?: string){
    return function decorator(
        target: Function,
        context: ClassMethodDecoratorContext
    ){
        return function replacementMethod(this: any, ...args: any) { 
        //return function replacementMethod(...args: any) { 
            const name = `${stepName || (context.name as string)} (${this.name})`
            return test.step(name, async ()=> {
                return await target.call(this, ...args)
            })
        }
    }
}

function formatDate(date: Date): string {
    return date.toISOString().replace('T', ' ').split('.')[0]; // 2025-02-26 02:26:30
}