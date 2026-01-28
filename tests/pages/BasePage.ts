import { Page, Locator, Expect, expect, TestInfo } from '@playwright/test';
import { step, test } from '../fixtures/BaseTest';
import { envHelper } from '../../utils/environment';

export class BasePage{
    protected page: Page;
    protected baseUrl: string;
    protected driverFile: string;
    protected driverPath: string;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = envHelper.getBaseUrl();
        this.driverFile = envHelper.getDataDriver();
        this.driverPath = "C:\\Data_Playwrigth\\";
    }

    //--------------------------------------------------------------------------------------------
    // Pagination Locators
    //--------------------------------------------------------------------------------------------

    protected get paginationSection(): Locator {
        return this.page.locator('p-paginator');
    }

    protected get firstPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'First Page' });
    }

    
    //--------------------------------------------------------------------------------------------
    // Base Page Common Methods
    //--------------------------------------------------------------------------------------------

    @step('Delay to wait couple seconds.')
    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    @step('Navigate to url')
    async goToPage(path: string = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
    }

    @step('Wait for page load')
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    @step('Get Page Title')
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    @step('Get Current Url')
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    @step('Is Locator Visible')
    async isLocatorVisible(locator: Locator): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                return false;
            }
            return await locator.isVisible();
        } catch {
            return false;
        }
    }

    //--------------------------------------------------------------------------------------------
    // Scroll to Top Methods
    //--------------------------------------------------------------------------------------------

    @step('Scroll to Bottom of Page')
    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    @step('Get Scroll Position')
    async getScrollPosition(): Promise<number> {
        return await this.page.evaluate(() => window.scrollY);
    }

    /**
     * Take screenshot and attach it to the test report
     * @param testInfo - TestInfo object from Playwright test context
     * @param attachmentName - Name to display in the test report
     * @param fullPage - Whether to capture full page (true) or viewport only (false). Default: false
     * @returns Promise<Buffer> - Screenshot buffer
     * @example
     * test('My Test', async ({ home }, testInfo) => {
     *   await home.attachScreenshot(testInfo, 'Home Page');
     *   await home.attachScreenshot(testInfo, 'Viewport Screenshot', false);
     * });
     */

    @step('Take screenshot and attach to test report')
    async attachScreenshot(testInfo: TestInfo, attachmentName: string, fullPage: boolean = false): Promise<Buffer> {
        const screenshotBuffer = await this.page.screenshot({
            fullPage: fullPage
        });
       
        await testInfo.attach(attachmentName, {
            body: screenshotBuffer,
            contentType: 'image/png',
        });
       
        console.log(`[Screenshot] ✅ Screenshot attached to test report: "${attachmentName}" (fullPage: ${fullPage})`);
        return screenshotBuffer;
    }

    /**
     * Take screenshot of specific element and attach it to the test report
     * @param testInfo - TestInfo object from Playwright test context
     * @param locator - Locator of the element to capture
     * @param attachmentName - Name to display in the test report
     * @returns Promise<Buffer | null> - Screenshot buffer, or null if element was not visible
     * @example
     * test('My Test', async ({ home }, testInfo) => {
     *   await home.attachElementScreenshot(testInfo, this.myButton, 'Button State');
     * });
     */

    @step('Take screenshot of element and attach to test report')
    async attachElementScreenshot(testInfo: TestInfo, locator: Locator, attachmentName: string): Promise<Buffer | null> {
        await expect.soft(locator, 'Element should be visible for screenshot').toBeVisible();
        let isCond = await this.isLocatorVisible(locator);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Screenshot] ${ctrlIcon} Element ${ctrlMessage}.`);
       
        if (isCond) {
            const screenshotBuffer = await locator.screenshot();
            await testInfo.attach(attachmentName, {
                body: screenshotBuffer,
                contentType: 'image/png',
            });
            console.log(`[Screenshot] ✅ Element screenshot attached to test report: "${attachmentName}"`);
            return screenshotBuffer;
        } else {
            console.log(`[Screenshot] ❌ Screenshot not attached - element not visible`);
            return null;
        }
    }
    

}