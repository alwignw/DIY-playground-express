import Express, { type Application } from "express";
import fs from "fs";
import path from "path";
import { Router, RequestHandler } from "express";
const app: Application = Express();

const routesDir = path.join(__dirname, "/");
const Route: Router = Router();

function getFunctionMethode(text: string): [string, string[]] {
  const methodRegex = /(_get|_post|_put|_delete|_patch)/i;
  const matches = text.match(methodRegex);
  if (!matches) {
    return [text, []];
  }
  const parts = text.split(methodRegex);
  const filteredParts = parts.filter((part: string) => part !== "");
  return [
    filteredParts[0],
    filteredParts.slice(1).map((it: string) => it.replace(/_/g, "")),
  ];
}

function readControllers(folder: string, baseUrl: string) {
  fs.readdirSync(folder).forEach((item: string) => {
    console.log(item);
    if (item !== "routes.ts" && item !== "routes.js") {
      const fullPath = path.join(folder, item);
      let routePath = ``;
      if (fs.statSync(fullPath).isDirectory()) {
        //   if(/^v\d+(\.\d+){0,2}$/.test(item)){ //validasi apakah foldername v{number semantic version} => v1 || v.1 || v.1.1}
        routePath = `${baseUrl}/${item}`;
        readControllers(fullPath, routePath);
        //   }
      } else {
        if (item.endsWith(".ts") || item.endsWith(".js")) {
          routePath = `${baseUrl}/${item.replace(/\.\w+$/, "")}`;
          let controller = require(fullPath);
          if (controller.default) {
            controller = { ...controller, ...controller.default };
            delete controller.default;
          }
          Object.keys(controller).forEach((action) => {
            Route.get(`${routePath}/${action}`, controller[action]);
            let parsedFunctionName: [string, string[]] =
              getFunctionMethode(action);
            parsedFunctionName[1].forEach((it) => {
              // console.log(it);
              (Route as any)[it](
                `${routePath}/${parsedFunctionName[0]}{/:uri1}`,
                controller[action]
              );
            });
          });
        }
      }
    }
  });
}

readControllers(routesDir, "");
app.use(Route);

export const routes = app;