const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.setViewportSize({width:1440,height:960});await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(1600);await page.screenshot({path:'/tmp/eclat-purple-desktop.png'});
 for(const width of [375,390,430,768,1024,1280,1440]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(100);
  const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.equal(size.scroll,width,'horizontal overflow '+JSON.stringify(size));console.log('Viewport OK:',width);
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(350);await page.screenshot({path:'/tmp/eclat-purple-mobile.png'});
 await page.locator('.menu-toggle').click();await page.waitForTimeout(700);assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');await page.waitForTimeout(500);assert.equal(await page.locator('#menu').isHidden(),true);
 await page.locator('#efeitos').scrollIntoViewIfNeeded();assert.equal(await page.locator('.effect-card:visible').count(),6);await page.locator('[data-filter="marcante"]').click();assert.equal(await page.locator('.effect-card:visible').count(),2);await page.locator('[data-filter="alongado"]').click();assert.equal(await page.locator('.effect-card:visible').count(),2);await page.locator('[data-filter="todos"]').click();assert.equal(await page.locator('.effect-card:visible').count(),6);
 for(const id of ['fox','luxo','russo','brasileiro','wispy','classico']){await page.locator(`[data-effect="${id}"] .effect-photo-button`).click();assert.equal(await page.locator('#effect-dialog').evaluate(d=>d.open),true);await page.keyboard.press('Escape')}
 await page.locator('[data-effect="fox"] .effect-details').click();await page.locator('.effect-book').click();assert.equal(await page.locator('#booking-dialog').evaluate(d=>d.open),true);assert.match(await page.locator('#booking-message').innerText(),/Fox Eyes/);await page.keyboard.press('Escape');
 await page.locator('[data-mood="marcante"]').click();await page.locator('[data-level="intenso"]').click();assert.match(await page.locator('.quiz-result').innerText(),/Volume Luxo/);await page.locator('[data-result]').click();assert.equal(await page.locator('#effect-dialog-title').innerText(),'Volume Luxo');await page.keyboard.press('Escape');await page.locator('.quiz-reset').click();assert.equal(await page.locator('[data-mood]').count(),3);
 await page.locator('summary').first().click();assert.equal(await page.locator('details').first().getAttribute('open'),'');
 await page.setViewportSize({width:1440,height:1000});
 for(const id of ['efeitos','match','experiencia','duvidas','agendar']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await page.screenshot({path:`/tmp/eclat-purple-${id}.png`});}
 await page.locator('#efeitos').scrollIntoViewIfNeeded();await page.waitForTimeout(300);assert.ok(await page.locator('.effect-card img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),'all six portraits loaded');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('.menu-toggle').click();assert.equal(await page.locator('#menu').isVisible(),true);await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);console.log('PASS: filters, six style details, personalized booking, quiz, menu/keyboard, FAQ, reduced motion and all images. No browser errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
