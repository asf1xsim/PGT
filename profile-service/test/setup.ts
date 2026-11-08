// profile-service/test/setup.ts
import 'reflect-metadata';
(global as any).reflectMetadataLoaded = true;
if (typeof Reflect.metadata !== 'function') {
    throw new Error('reflect-metadata не загружен корректно');
}