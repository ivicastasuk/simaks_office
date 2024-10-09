const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // ucitaj HTML fajl
        const htmlPath = path.resolve('./src/server/templates/ponuda.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Postavi sadrzaj stranice
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });

        await page.addStyleTag({
            content: `
                * {
                    outline: none !important;
                }
            `,
        });

        // Generisi PDF
        await page.pdf({
            path: './src/server/templates/ponuda.pdf',
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        console.log('PDF uspesno generisan.');
    } catch (error) {
        console.error('Doslo je do greske:', error);
    }
})();


// const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
// const fs = require('fs');

// (async () => {
//   try {
//     const publicKey = 'project_public_689d1a650ab2263a1b1be1b5a2c6c9cf_waSQs9fc5d2c5928c55a9e50bfd6f8a18f640';
//     const secretKey = 'secret_key_37585d2094997b0c03edba2d94a078b1_xSsg7877304158cd790d2657c89358a6d189e';

//     const instance = new ILovePDFApi(publicKey, secretKey);
//     const task = instance.newTask('htmlpdf');

//     task.start()
//     .then(() => {
//         const htmlContent = "<html><body><h1>Proba PDF konvertovanja</h1></body></html>";
//         return task.addFile('https://www.simaks.rs/files/ponuda.html');
//     })
//     .then(() => {
//         return task.process({
//             page_orientation: 'landscape',
//             page_size: 'A4'
//         });
//     })
//     .then(() => {
//         return task.download();
//     })
//     .then((data) => {
//         fs.writeFileSync('./src/server/templates/ponuda.pdf', data);
//     });

//     console.log('PDF uspesno generisan.');
//   } catch (error) {
//     console.error('Doslo je do greske:', error);
//   }
// })();

