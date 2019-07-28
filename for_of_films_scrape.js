const puppeteer = require('puppeteer');
const fs = require('fs');

let filmNames = ['Король лев', 'Леон']

let scrape = async () => {    
    const browser = await puppeteer.launch({headless: false}); //{headless: false}

    for (const row of filmNames) {
        const page = await browser.newPage();
        try {
            await page.goto('https://www.kinopoisk.ru/', {waitUntil: 'networkidle2'}); //

            await page.waitFor('input[name=kp_query]');
            await page.type('input[name=kp_query]', row);

            await page.click('button[type="button"]');
            await page.waitForSelector('.most_wanted');
            await page.click('#block_left_pad > div > div:nth-child(3) > div > div.info > p > a');
            await page.waitForSelector('.movie-info__content');

            const result = await page.evaluate(() => {
                const tds = Array.from(document.querySelectorAll('table tr')) // td
                console.log('tds', tds);
                return tds.map(tr => tr.innerText)
            });
                
            //browser.close();
            return result;  
        
          //await page.goto(`url/search?action=getname&name=${row.value}`);
        } finally {
          await page.close();
        }
      }
      
};

scrape().then((value) => {
     // Получилось!
    let data = new Object()
    data['Леон'] = value

    fs.writeFile ("output.json", JSON.stringify(data), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
});



