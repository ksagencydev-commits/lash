import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {config} from '../config.js';
test('every local page asset and style portrait is present in the production build',()=>{
 const html=readFileSync('dist/index.html','utf8');
 for(const [,path] of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g))assert.ok(existsSync('dist'+path),path);
 for(const service of config.services){assert.ok(existsSync('dist/public/images/'+service.image),service.image);assert.ok(statSync('dist/public/images/'+service.image).size<800000,'image budget: '+service.image)}
});
test('catalog offers six distinct styles, people and filtering categories',()=>{
 assert.equal(config.services.length,6);assert.equal(new Set(config.services.map(s=>s.image)).size,6);
 for(const id of ['fox','luxo','russo','brasileiro','wispy','classico'])assert.ok(config.services.some(s=>s.id===id));
 for(const category of ['natural','alongado','marcante'])assert.equal(config.services.filter(s=>s.category===category).length,2);
});
test('booking remains demonstrative until a real contact is supplied',()=>{
 assert.equal(config.whatsapp,'');assert.ok(readFileSync('index.html','utf8').includes('modo demonstrativo'));
 assert.ok(!existsSync('dist/.git'));assert.ok(!existsSync('dist/sculpture.js'));assert.ok(existsSync('dist/public/vendor/three.module.js'));assert.ok(existsSync('dist/brush.js'));
});
