const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/get-datadome', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Linux; Android 16; CPH2613 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.111 Mobile Safari/537.36');
    
    await page.goto('https://shop.garena.my/?app=100067', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    const cookies = await page.cookies();
    const datadome = cookies.find(c => c.name === 'datadome');
    
    await browser.close();
    
    if (datadome) {
      res.json({ success: true, datadome: datadome.value });
    } else {
      res.json({ success: false, error: 'DataDome not found' });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
