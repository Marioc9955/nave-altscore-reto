import {Application, Router} from 'https://deno.land/x/oak@v12.6.1/mod.ts';

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

function getFYByTwoPoints(x1: number, y1: number, x2: number, y2: number): (x: number) => number {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return (y: number) => (y - b) / m;
}

function roundToPrecision(value: number, precision: number = 5): number {
    return Number(value.toFixed(precision));
}

function getPhaseChangeData(pressure: number): Record<string, number> {
    const specific_volume_liquid =
        getFYByTwoPoints(0.0035, 10, 0.00105, 0.05)(pressure);
    const specific_volume_vapor =
        getFYByTwoPoints(0.0035, 10, 30, 0.05)(pressure);

    return {
        specific_volume_liquid: roundToPrecision(specific_volume_liquid),
        specific_volume_vapor: roundToPrecision(specific_volume_vapor),
    };
}

router.get("/phase-change-diagram", (ctx) => {
    const pressure = Number(ctx.request.url.searchParams.get("pressure"));
    if (isNaN(pressure)) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid pressure value" };
        return;
    }
    ctx.response.body = getPhaseChangeData(pressure);
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
