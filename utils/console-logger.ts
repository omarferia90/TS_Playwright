import { expect,  type Locator, type Page, type ConsoleMessage } from '@playwright/test';
import { step, test } from '../tests/fixtures/BaseTest';


export class ConsoleLogger {
    private name = "Console Logger";
    private logs: ConsoleMessage[] = [];

    constructor(private page: Page){
        this.setupListener();
    }

    private setupListener(){
        this.page.on('console', (msg) => {
            if(msg.type() === 'log' || msg.type() === 'error' || msg.type() === 'warning') {
                this.logs.push(msg);
            }
        });
    }

    private getErrors(): string[] {
        return this.logs.map(log => log.text());
    }

    private clearLogs(){
        this.logs = [];
    }


    @step('Get and Clean Console Log Errors')
    public async getAndClearErrors() {
        const currentErrors = this.getErrors();
        await expect.soft(currentErrors.length, `Console log messages found: ${currentErrors.length}`).toBe(0);
        console.log(`[Console Log Validation]`);
        if(currentErrors.length == 0){
            console.log(`✅ No Console Logs Error were found.`);
        } else{
            currentErrors.forEach(error => {
                console.log(`❌ [Console Log Message Found] ${error}`);
            });
        } 
        this.clearLogs();
    }


}