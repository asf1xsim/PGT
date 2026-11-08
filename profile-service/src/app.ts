// profile-service/src/app.ts
import 'reflect-metadata';
import { app } from './server';
import mongo from './database/mongo';
import { Config } from '../config';

const port = Config.port || 3002;

async function init() {
    await mongo.connect();

    app.listen(port, () => {
        console.log(`Profile Service listening on http://localhost:${port}`);
        console.log(`API Docs available at http://localhost:${port}/api-docs`);
    });
}

init();

export default app;