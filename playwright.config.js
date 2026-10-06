// Tests run the style guide page in Chromium. In CI, Playwright's own Chromium is installed; on a
// machine without it, point PW_EXECUTABLE_PATH at any Chromium-based browser (Chrome, Brave, Edge).
//   npm test                 behaviour and accessibility (what CI runs)
//   npm run test:visual      screenshots of every section, compared with tests/visual.spec.js-snapshots
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: 'http://localhost:4322',
		viewport: { width: 1360, height: 900 },
		launchOptions: process.env.PW_EXECUTABLE_PATH ? { executablePath: process.env.PW_EXECUTABLE_PATH } : {}
	},
	expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
	webServer: {
		command: 'node scripts/serve.mjs',
		env: { PORT: '4322' },
		url: 'http://localhost:4322',
		reuseExistingServer: !process.env.CI
	}
});
