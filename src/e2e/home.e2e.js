const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

describe('SearchPage', () => {
  beforeAll(async () => {
    jest.setTimeout(1000000);
  });
  it('it should have logo text', async () => {
    await page.goto(BASE_URL);
    await page.waitForSelector('h1', {
      timeout: 5000,
    });
    const text = await page.evaluate(() => document.getElementsByTagName('h1')[0].innerText);
    expect(text).toContain('新一代经营分析系统');
  });
});
