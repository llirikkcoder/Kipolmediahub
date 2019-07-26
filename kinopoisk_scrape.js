//const puppeteer = require('puppeteer');
const fs = require('fs');
const { Cluster } = require('puppeteer-cluster');

let filmNames = ['Леон','Король лев']

let scrape = async () => {
    // Create a cluster with 2 workers
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
    });

    // Define a task (in this case: screenshot of page)
    const movie = await cluster.task(async ({ page, data: filmName }) => {
        await page.goto('https://www.kinopoisk.ru/');
        await page.waitFor('input[name=kp_query]');
        await page.type('input[name=kp_query]', filmName);

        await page.click('button[type="button"]');
        await page.waitForSelector('.most_wanted');
        await page.click('#block_left_pad > div > div:nth-child(3) > div > div.info > p > a');
        await page.waitForSelector('.movie-info__content');

        const path = filmName.replace(/[^a-zA-Z]/g, '_') + '.png';
        await page.screenshot({ path });
        console.log(`Screenshot of ${filmName} saved: ${path}`);

        const result = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table tr')) // td
            return tds.map(tr => tr.innerText)
        });
        console.log('Result:', result);  
        return result;

    });
    
    // Add some pages to queue
    cluster.queue('Леон');
    cluster.queue('Король лев');

    // Shutdown after everything is done
    await cluster.idle();
    await cluster.close();
    
    return movie;
};

scrape().then((value) => {
    console.log(value); // Получилось!
    let data = new Object()
    data['Леон'] = value

    fs.writeFile ("output.json", JSON.stringify(data), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
});



