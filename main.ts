
import { Application, Router } from 'https://deno.land/x/oak@v12.6.1/mod.ts';

const systemCodes: Record<string, string> = {
    navigation: 'NAV-01',
    communications: 'COM-02',
    life_support: 'LIFE-03',
    engines: 'ENG-04',
    deflector_shield: 'SHLD-05',
};

const systems = Object.keys(systemCodes);
let damagedSystem = systems[Math.floor(Math.random() * systems.length)];

const router = new Router();

router.get("/status", (ctx) => {
    ctx.response.body = { damaged_system: damagedSystem };
});

router.get("/repair-bay", (ctx) => {
    const code = systemCodes[damagedSystem];
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = `
    <!DOCTYPE html>
    <html>
      <head><title>Repair</title></head>
      <body>
        <div class="anchor-point">${code}</div>
      </body>
    </html>
  `;
});

router.post("/teapot", (ctx) => {
    ctx.response.status = 418;
    ctx.response.body = "I'm a teapot.";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
