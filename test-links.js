const { chromium } = require('playwright');

const urls = [
  // Exhibit A - OpenAI funding (The Verge)
  { url: 'https://www.theverge.com/ai-artificial-intelligence/885958/openai-amazon-nvidia-softback-110-billion-investment', keywords: ['110 billion', 'OpenAI', '900 million'] },
  
  // Exhibit B - Block layoffs + Burger King (BBC)
  { url: 'https://www.bbc.com/news/articles/cq570d12y9do', keywords: ['Block', 'layoff', 'AI'] },
  { url: 'https://www.bbc.com/news/articles/cgk2zygg0k3o', keywords: ['Burger King', 'AI'] },
  
  // Exhibit C - Gemini errands (WIRED)
  { url: 'https://www.wired.com/story/google-gemini-task-automation-galaxy-s26-uber-doordash/', keywords: ['Gemini', 'Uber', 'Galaxy'] },
  
  // Exhibit D - Pentagon/Anthropic (WIRED + Ars Technica)
  { url: 'https://www.wired.com/story/trump-moves-to-ban-anthropic-from-the-us-government/', keywords: ['Trump', 'Anthropic', 'ban'] },
  { url: 'https://arstechnica.com/ai/2026/02/pete-hegseth-wants-unfettered-access-to-anthropics-models-for-the-military/', keywords: ['Hegseth', 'Anthropic', 'military'] },
  
  // Exhibit E - Perplexity Computer (Ars Technica)
  { url: 'https://arstechnica.com/ai/2026/02/perplexity-announces-computer-an-ai-agent-that-assigns-work-to-other-ai-agents/', keywords: ['Perplexity', 'Computer', 'agent'] },
  
  // Exhibit F - Galaxy S26 AI camera (Ars Technica + The Verge)
  { url: 'https://arstechnica.com/gadgets/2026/02/samsung-reveals-galaxy-s26-lineup-with-privacy-display-and-exclusive-gemini-smarts/', keywords: ['Galaxy', 'S26', 'Samsung'] },
  { url: 'https://www.theverge.com/podcast/885942/samsung-galaxy-s26-ai-camera-nightmare-vergecast', keywords: ['Galaxy', 'S26', 'camera'] },
  
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
