// auth-service/src/app.ts
import 'reflect-metadata';
import mongo from "./database/mongo";
import {Config} from "../config";
import {app} from "./api/server";

const port = Config.port || 3001;

async function init() {
    await mongo.connect();

    app.listen(port, () => {
        console.log(`Auth Service listening on http://localhost:${port}`);
        console.log(`📚 Swagger: http://localhost:${port}/api-docs`);
    });
}

init();