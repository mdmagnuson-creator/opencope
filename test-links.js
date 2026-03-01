const { chromium } = require('playwright');

const urls = [
  // Verified working URLs from The Verge
  { url: 'https://www.theverge.com/ai-artificial-intelligence/885958/openai-amazon-nvidia-softback-110-billion-investment', keywords: ['110 billion', 'OpenAI', '900 million'] },
  { url: 'https://www.theverge.com/ai-artificial-intelligence/884911/burger-king-ai-assistant-patty', keywords: ['Burger King', 'AI', 'Patty'] },
  { url: 'https://www.theverge.com/policy/886632/pentagon-designates-anthropic-supply-chain-risk-ai-standoff', keywords: ['Pentagon', 'Anthropic', 'supply chain'] },
  { url: 'https://www.theverge.com/ai-artificial-intelligence/886486/even-ilya-sutskever-weighed-in-on-the-anthropic-pentagon-situation', keywords: ['Ilya', 'Sutskever', 'Anthropic'] },
  { url: 'https://www.theverge.com/podcast/885942/samsung-galaxy-s26-ai-camera-nightmare-vergecast', keywords: ['Galaxy', 'S26', 'camera', 'photography'] },
  // Index pages (used for stories without direct article URLs found)
  { url: 'https://www.theverge.com/ai-artificial-intelligence', keywords: ['Block', 'Perplexity', 'Claude'] },
  { url: 'https://www.theverge.com/google', keywords: ['Gemini', 'Pixel', 'Uber'] },
  // The memo link
  { url: 'https://mdmagnuson-creator.github.io/opencode-toolkit-website/memo/', keywords: ['memo', 'context', 'software'] },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  console.log('OpenCope Citation Link Verification');
  console.log('====================================\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const { url, keywords } of urls) {
    const page = await context.newPage();
    try {
      const response = await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
      const status = response?.status() || 'no response';
      const text = await page.textContent('body').catch(() => '');
      const found = keywords.filter(k => text.toLowerCase().includes(k.toLowerCase()));
      
      console.log(`--- ${url}`);
      console.log(`    Status: ${status}`);
      console.log(`    Keywords: ${found.length}/${keywords.length} [${found.join(', ')}]`);
      
      if (status === 200 && found.length > 0) {
        console.log(`    ✅ PASS\n`);
        passed++;
      } else if (status === 200) {
        console.log(`    ⚠️  PAGE LOADS BUT KEYWORDS NOT FOUND\n`);
        failed++;
      } else {
        console.log(`    ❌ FAIL (status ${status})\n`);
        failed++;
      }
    } catch (err) {
      console.log(`--- ${url}`);
      console.log(`    ERROR: ${err.message}`);
      console.log(`    ❌ FAIL\n`);
      failed++;
    }
    await page.close();
  }
  
  console.log('====================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
