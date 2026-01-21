# Performance Baseline Report

Generated: 2026-01-21T04:28:22.229Z
Node.js: v22.15.0
Platform: win32

## Summary

| Metric | Status | Duration | Notes |
|--------|--------|----------|-------|
| TypeScript Check | ❌ FAIL | N/A | Type errors found |
| Build Process | ❌ FAIL | N/A | Build failed |
| Test Execution | ❌ FAIL | N/A | Tests failed or timed out |

## Bundle Analysis


- **Total Bundle Size**: 2.11 GB
- **Static Assets**: 9.47 MB
- **Server Bundle**: 18.94 MB


## Dependency Metrics


- **Production Dependencies**: 36
- **Development Dependencies**: 30
- **Payload Dependencies**: 12
- **React Dependencies**: 10
- **Next.js Dependencies**: 3
- **node_modules Size**: 3.6 GB


## Detailed Results

### TypeScript Compilation

❌ **Status**: Failed
📝 **Error**: Command failed: npx tsc --noEmit


### Build Process

❌ **Status**: Failed
📝 **Error**: Command failed: npm run build
 ⚠ The config property `experimental.turbo` is deprecated. Move this setting to `config.turbopack` as Turbopack is now stable.

[1m[33mwarn[39m[22m - The class `delay-[150ms]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `delay-&lsqb;150ms&rsqb;` to silence this warning.

[1m[33mwarn[39m[22m - The class `delay-[75ms]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `delay-&lsqb;75ms&rsqb;` to silence this warning.

[1m[33mwarn[39m[22m - The class `duration-[10000ms]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `duration-&lsqb;10000ms&rsqb;` to silence this warning.

[1m[33mwarn[39m[22m - The class `ease-[cubic-bezier(0.23,1,0.32,1)]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `ease-&lsqb;cubic-bezier(0.23,1,0.32,1)&rsqb;` to silence this warning.
Failed to compile.

./node_modules/.pnpm/pino-abstract-transport@2.0.0/node_modules/pino-abstract-transport/index.js
Module not found: Can't resolve 'worker_threads'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./node_modules/.pnpm/pino-pretty@13.1.2/node_modules/pino-pretty/index.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/utilities/logger.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/index.js
./node_modules/.pnpm/@payloadcms+richtext-lexica_40e70bfa9ed5e5ff6065658076d1adfe/node_modules/@payloadcms/richtext-lexical/dist/index.js
./src/blocks/CallToAction/config.ts
./src/pages/Pages/index.ts

node:assert
Module build failed: UnhandledSchemeError: Reading from "node:assert" is not handled by plugins (Unhandled scheme).
Webpack supports "data:" and "file:" URIs by default.
You may need an additional plugin to handle "node:" URIs.
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408351
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at Object.processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408276)
    at processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:5308)
    at iteratePitchingLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:4667)
    at runLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:8590)
    at NormalModule._doBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408138)
    at NormalModule.build (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:410151)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82479
    at NormalModule.needBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:414135)
    at Compilation._buildModule (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82196)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1378123
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at AsyncQueue._startProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377994)
    at AsyncQueue._ensureProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377843)
    at process.processImmediate (node:internal/timers:485:21)

Import trace for requested module:
node:assert
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/utilities/telemetry/conf/index.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/utilities/telemetry/index.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/utilities/telemetry/events/serverInit.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/index.js
./node_modules/.pnpm/@payloadcms+richtext-lexica_40e70bfa9ed5e5ff6065658076d1adfe/node_modules/@payloadcms/richtext-lexical/dist/index.js
./src/blocks/CallToAction/config.ts

node:async_hooks
Module build failed: UnhandledSchemeError: Reading from "node:async_hooks" is not handled by plugins (Unhandled scheme).
Webpack supports "data:" and "file:" URIs by default.
You may need an additional plugin to handle "node:" URIs.
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408351
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at Object.processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408276)
    at processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:5308)
    at iteratePitchingLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:4667)
    at runLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:8590)
    at NormalModule._doBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408138)
    at NormalModule.build (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:410151)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82479
    at NormalModule.needBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:414135)
    at Compilation._buildModule (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82196)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1378123
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at AsyncQueue._startProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377994)
    at AsyncQueue._ensureProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377843)
    at process.processImmediate (node:internal/timers:485:21)

Import trace for requested module:
node:async_hooks
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/lib/api/api-request.js
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/lib/api/index.js
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/index.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/uploads/safeFetch.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/index.js
./node_modules/.pnpm/@payloadcms+richtext-lexica_40e70bfa9ed5e5ff6065658076d1adfe/node_modules/@payloadcms/richtext-lexical/dist/index.js
./src/blocks/CallToAction/config.ts

node:buffer
Module build failed: UnhandledSchemeError: Reading from "node:buffer" is not handled by plugins (Unhandled scheme).
Webpack supports "data:" and "file:" URIs by default.
You may need an additional plugin to handle "node:" URIs.
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408351
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at Object.processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408276)
    at processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:5308)
    at iteratePitchingLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:4667)
    at runLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:8590)
    at NormalModule._doBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408138)
    at NormalModule.build (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:410151)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82479
    at NormalModule.needBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:414135)
    at Compilation._buildModule (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82196)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1378123
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at AsyncQueue._startProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377994)
    at AsyncQueue._ensureProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377843)
    at process.processImmediate (node:internal/timers:485:21)

Import trace for requested module:
node:buffer
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/lib/core/util.js
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/index.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/uploads/safeFetch.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/index.js
./node_modules/.pnpm/@payloadcms+richtext-lexica_40e70bfa9ed5e5ff6065658076d1adfe/node_modules/@payloadcms/richtext-lexical/dist/index.js
./src/blocks/CallToAction/config.ts

node:console
Module build failed: UnhandledSchemeError: Reading from "node:console" is not handled by plugins (Unhandled scheme).
Webpack supports "data:" and "file:" URIs by default.
You may need an additional plugin to handle "node:" URIs.
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408351
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at Object.processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408276)
    at processResource (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:5308)
    at iteratePitchingLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:4667)
    at runLoaders (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\loader-runner\LoaderRunner.js:1:8590)
    at NormalModule._doBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:408138)
    at NormalModule.build (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:410151)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82479
    at NormalModule.needBuild (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:414135)
    at Compilation._buildModule (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:82196)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1378123
    at Hook.eval [as callAsync] (eval at create (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:14:9224), <anonymous>:6:1)
    at AsyncQueue._startProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377994)
    at AsyncQueue._ensureProcessing (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\next@15.4.10_@babel+core@7._a8cb9100fe6361a00655d7ad06bce434\node_modules\next\dist\compiled\webpack\bundle5.js:29:1377843)
    at process.processImmediate (node:internal/timers:485:21)

Import trace for requested module:
node:console
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/lib/mock/pending-interceptors-formatter.js
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/lib/mock/mock-agent.js
./node_modules/.pnpm/undici@7.10.0/node_modules/undici/index.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/uploads/safeFetch.js
./node_modules/.pnpm/payload@3.70.0_graphql@16.12.0_typescript@5.7.3/node_modules/payload/dist/index.js
./node_modules/.pnpm/@payloadcms+richtext-lexica_40e70bfa9ed5e5ff6065658076d1adfe/node_modules/@payloadcms/richtext-lexical/dist/index.js
./src/blocks/CallToAction/config.ts


> Build failed because of webpack errors



### Test Execution

❌ **Status**: Failed
📝 **Error**: Command failed: npm run test -- --run
[90mstderr[2m | tests/unit/responsive/responsive-integration.unit.spec.ts[2m > [22m[2mResponsive Design Integration[2m > [22m[2mError Handling[2m > [22m[2mshould handle missing device configurations
[22m[39mDevice configuration not found: non-existent-device

[90mstderr[2m | tests/unit/richtext/richtext-color-contrast.unit.spec.ts[2m > [22m[2mRichText Color Contrast[2m > [22m[2mWCAG 2.1 AA Compliance - Light Theme[2m > [22m[2mshould have no color contrast violations
[22m[39mError: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
    at module.exports (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\jsdom@26.1.0\node_modules\jsdom\lib\jsdom\browser\not-implemented.js:9:17)
    at HTMLCanvasElementImpl.getContext (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\jsdom@26.1.0\node_modules\jsdom\lib\jsdom\living\nodes\HTMLCanvasElement-impl.js:42:5)
    at HTMLCanvasElement.getContext (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\jsdom@26.1.0\node_modules\jsdom\lib\jsdom\living\generated\HTMLCanvasElement.js:131:58)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:13407:49
    at Object.get (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:7719:23)
    at _isIconLigature (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:13406:41)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:27313:54
    at Array.some (<anonymous>)
    at hasRealTextChildren (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:27312:35)
    at Rule.colorContrastMatches [as matches] (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:27277:12) [90mundefined[39m

[90mstderr[2m | tests/unit/richtext/richtext-color-contrast.unit.spec.ts[2m > [22m[2mRichText Color Contrast[2m > [22m[2mWCAG 2.1 AA Compliance - Dark Theme[2m > [22m[2mshould have no color contrast violations in dark theme
[22m[39mError: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
    at module.exports (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\jsdom@26.1.0\node_modules\jsdom\lib\jsdom\browser\not-implemented.js:9:17)
    at HTMLCanvasElementImpl.getContext (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\jsdom@26.1.0\node_modules\jsdom\lib\jsdom\living\nodes\HTMLCanvasElement-impl.js:42:5)
    at HTMLCanvasElement.getContext (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\jsdom@26.1.0\node_modules\jsdom\lib\jsdom\living\generated\HTMLCanvasElement.js:131:58)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:13407:49
    at Object.get (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:7719:23)
    at _isIconLigature (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:13406:41)
    at C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:27313:54
    at Array.some (<anonymous>)
    at hasRealTextChildren (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:27312:35)
    at Rule.colorContrastMatches [as matches] (C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\axe-core@4.10.2\node_modules\axe-core\axe.js:27277:12) [90mundefined[39m


[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 17 [49m[22m[31m⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m tests/int/access-control.int.spec.ts[2m [ tests/int/access-control.int.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/performance/load.perf.spec.ts[2m [ tests/performance/load.perf.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/performance/queries.perf.spec.ts[2m [ tests/performance/queries.perf.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/int/collections/blogs.int.spec.ts[2m [ tests/int/collections/blogs.int.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/int/collections/contacts.int.spec.ts[2m [ tests/int/collections/contacts.int.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/int/collections/legal.int.spec.ts[2m [ tests/int/collections/legal.int.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/int/collections/pages.int.spec.ts[2m [ tests/int/collections/pages.int.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/int/collections/services.int.spec.ts[2m [ tests/int/collections/services.int.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/pbt/utilities/slugUniqueness.pbt.spec.ts[2m [ tests/pbt/utilities/slugUniqueness.pbt.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/unit/fields/richTextFeatures.unit.spec.ts[2m [ tests/unit/fields/richTextFeatures.unit.spec.ts ][22m
[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-accessibility.unit.spec.ts[2m [ tests/unit/richtext/richtext-accessibility.unit.spec.ts ][22m
[31m[1mTypeError[22m: Unknown file extension ".scss" for C:\Users\omkar\Desktop\Omkar\VisualStudioCode\OD-LABS-Payload\node_modules\.pnpm\@payloadcms+ui@3.70.0_@type_75d8ab872803eb91a79fe44ceccfaaec\node_modules\@payloadcms\ui\dist\icons\Copy\index.scss[39m
[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/int/richtext/richtext-block-contexts.int.spec.ts[2m [ tests/int/richtext/richtext-block-contexts.int.spec.ts ][22m
[31m[1mError[22m: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.[39m
[90m [2m❯[22m TestTypeImpl._currentSuite node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m74:13[22m[39m
[90m [2m❯[22m TestTypeImpl._describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m114:24[22m[39m
[90m [2m❯[22m Function.describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/transform/transform.js:[2m275:12[22m[39m
[36m [2m❯[22m tests/int/richtext/richtext-block-contexts.int.spec.ts:[2m293:6[22m[39m
    [90m291| [39m}
    [90m292| [39m
    [90m293| [39mtest[33m.[39m[34mdescribe[39m([32m'Block Functionality and Page Collections'[39m[33m,[39m () [33m=>[39m {
    [90m   | [39m     [31m^[39m
    [90m294| [39m  test[33m.[39m[34mbeforeEach[39m([35masync[39m ({ page }) [33m=>[39m {
    [90m295| [39m    [35mawait[39m [34mloginAsAdmin[39m(page)

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/int/richtext/richtext-cross-device.int.spec.tsx[2m [ tests/int/richtext/richtext-cross-device.int.spec.tsx ][22m
[31m[1mError[22m: Failed to resolve import "../utils/testHelpers" from "tests/int/richtext/richtext-cross-device.int.spec.tsx". Does the file exist?[39m
  Plugin: [35mvite:import-analysis[39m
  File: [36mC:/Users/omkar/Desktop/Omkar/VisualStudioCode/OD-LABS-Payload/tests/int/richtext/richtext-cross-device.int.spec.tsx[39m:16:39
[33m  9  |    testPerformanceAcrossDevices
  10 |  } from "@/components/ui/RichText/utils/deviceTestingUtils";
  11 |  import { createMockRichTextData } from "../utils/testHelpers";
     |                                          ^
  12 |  const complexRichTextData = createMockRichTextData({
  13 |    root: {[39m
[90m [2m❯[22m TransformPluginContext._formatLog node_modules/.pnpm/vite@7.3.0_@types+node@22.1_4180273cb6b03fe952c11f553f355974/node_modules/vite/dist/node/chunks/config.js:[2m28998:43[22m[39m
[90m [2m❯[22m TransformPluginContext.error node_modules/.pnpm/vite@7.3.0_@types+node@22.1_4180273cb6b03fe952c11f553f355974/node_modules/vite/dist/node/chunks/config.js:[2m28995:14[22m[39m
[90m [2m❯[22m normalizeUrl node_modules/.pnpm/vite@7.3.0_@types+node@22.1_4180273cb6b03fe952c11f553f355974/node_modules/vite/dist/node/chunks/config.js:[2m27118:18[22m[39m
[90m [2m❯[22m node_modules/.pnpm/vite@7.3.0_@types+node@22.1_4180273cb6b03fe952c11f553f355974/node_modules/vite/dist/node/chunks/config.js:[2m27176:32[22m[39m
[90m [2m❯[22m TransformPluginContext.transform node_modules/.pnpm/vite@7.3.0_@types+node@22.1_4180273cb6b03fe952c11f553f355974/node_modules/vite/dist/node/chunks/config.js:[2m27144:4[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform node_modules/.pnpm/vite@7.3.0_@types+node@22.1_4180273cb6b03fe952c11f553f355974/node_modules/vite/dist/node/chunks/config.js:[2m28796:14[22m[39m
[90m [2m❯[22m loadAndTransform node_modules/.pnpm/vite@7.3.0_@types+node@22.1_4180273cb6b03fe952c11f553f355974/node_modules/vite/dist/node/chunks/config.js:[2m22669:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/int/richtext/richtext-editor-workflow.int.spec.ts[2m [ tests/int/richtext/richtext-editor-workflow.int.spec.ts ][22m
[31m[1mError[22m: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.[39m
[90m [2m❯[22m TestTypeImpl._currentSuite node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m74:13[22m[39m
[90m [2m❯[22m TestTypeImpl._describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m114:24[22m[39m
[90m [2m❯[22m Function.describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/transform/transform.js:[2m275:12[22m[39m
[36m [2m❯[22m tests/int/richtext/richtext-editor-workflow.int.spec.ts:[2m392:6[22m[39m
    [90m390| [39m}
    [90m391| [39m
    [90m392| [39mtest[33m.[39m[34mdescribe[39m([32m'RichText Editor Workflow Tests'[39m[33m,[39m () [33m=>[39m {
    [90m   | [39m     [31m^[39m
    [90m393| [39m  test[33m.[39m[34mbeforeEach[39m([35masync[39m ({ page }) [33m=>[39m {
    [90m394| [39m    [35mawait[39m [34mloginAsAdmin[39m(page)

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/int/richtext/richtext-frontend-rendering.int.spec.ts[2m [ tests/int/richtext/richtext-frontend-rendering.int.spec.ts ][22m
[31m[1mError[22m: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.[39m
[90m [2m❯[22m TestTypeImpl._currentSuite node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m74:13[22m[39m
[90m [2m❯[22m TestTypeImpl._describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m114:24[22m[39m
[90m [2m❯[22m Function.describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/transform/transform.js:[2m275:12[22m[39m
[36m [2m❯[22m tests/int/richtext/richtext-frontend-rendering.int.spec.ts:[2m416:6[22m[39m
    [90m414| [39m}
    [90m415| [39m
    [90m416| [39mtest[33m.[39m[34mdescribe[39m([32m'RichText Frontend Rendering Tests'[39m[33m,[39m () [33m=>[39m {
    [90m   | [39m     [31m^[39m
    [90m417| [39m  test[33m.[39m[34mbeforeEach[39m([35masync[39m ({ page }) [33m=>[39m {
    [90m418| [39m    [35mawait[39m [34mloginAsAdmin[39m(page)

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/int/richtext/richtext-responsive.int.spec.ts[2m [ tests/int/richtext/richtext-responsive.int.spec.ts ][22m
[31m[1mError[22m: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.[39m
[90m [2m❯[22m TestTypeImpl._currentSuite node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m74:13[22m[39m
[90m [2m❯[22m TestTypeImpl._describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m114:24[22m[39m
[90m [2m❯[22m Function.describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/transform/transform.js:[2m275:12[22m[39m
[36m [2m❯[22m tests/int/richtext/richtext-responsive.int.spec.ts:[2m71:6[22m[39m
    [90m 69| [39m}
    [90m 70| [39m
    [90m 71| [39mtest[33m.[39m[34mdescribe[39m([32m'RichText Responsive Behavior'[39m[33m,[39m () [33m=>[39m {
    [90m   | [39m     [31m^[39m
    [90m 72| [39m  [90m// Unit-level responsive component tests[39m
    [90m 73| [39m  test[33m.[39m[34mdescribe[39m([32m'Component Responsive Design (Unit Level)'[39m[33m,[39m () [33m=>[39m {

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/performance/richtext/richtext-editor.perf.spec.ts[2m [ tests/performance/richtext/richtext-editor.perf.spec.ts ][22m
[31m[1mError[22m: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.[39m
[90m [2m❯[22m TestTypeImpl._currentSuite node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m74:13[22m[39m
[90m [2m❯[22m TestTypeImpl._describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/common/testType.js:[2m114:24[22m[39m
[90m [2m❯[22m Function.describe node_modules/.pnpm/playwright@1.56.1/node_modules/playwright/lib/transform/transform.js:[2m275:12[22m[39m
[36m [2m❯[22m tests/performance/richtext/richtext-editor.perf.spec.ts:[2m110:6[22m[39m
    [90m108| [39m}
    [90m109| [39m
    [90m110| [39mtest[33m.[39m[34mdescribe[39m([32m'RichText Editor Performance Tests'[39m[33m,[39m () [33m=>[39m {
    [90m   | [39m     [31m^[39m
    [90m111| [39m  test[33m.[39m[34mbeforeEach[39m([35masync[39m ({ page }) [33m=>[39m {
    [90m112| [39m    [35mawait[39m [34mloginAsAdmin[39m(page)

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/28]⎯[22m[39m


[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 11 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m tests/unit/responsive/responsive-integration.unit.spec.ts[2m > [22mResponsive Design Integration[2m > [22mPerformance Across Devices[2m > [22mshould maintain reasonable performance on all device types
[31m[1mAssertionError[22m: expected 162.5627000000004 to be less than 100[39m
[36m [2m❯[22m tests/unit/responsive/responsive-integration.unit.spec.ts:[2m267:22[22m[39m
    [90m265| [39m      [90m// All operations should complete within reasonable time[39m
    [90m266| [39m      Object.entries(performanceResults).forEach(([deviceKey, time]) =…
    [90m267| [39m        expect(time).toBeLessThan(100) // 100ms should be more than en…
    [90m   | [39m                     [31m^[39m
    [90m268| [39m      })
    [90m269| [39m
[90m [2m❯[22m tests/unit/responsive/responsive-integration.unit.spec.ts:[2m266:42[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mFocusable Elements Detection[2m > [22mshould find focusable elements in container
[31m[1mAssertionError[22m: expected [] to have a length of 3 but got +0[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- 3[39m
[31m+ 0[39m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m61:33[22m[39m
    [90m 59| [39m
    [90m 60| [39m      [35mconst[39m focusableElements [33m=[39m [34mgetFocusableElements[39m(container)
    [90m 61| [39m      [34mexpect[39m(focusableElements)[33m.[39m[34mtoHaveLength[39m([34m3[39m)
    [90m   | [39m                                [31m^[39m
    [90m 62| [39m      [34mexpect[39m(focusableElements)[33m.[39m[34mtoContain[39m(button)
    [90m 63| [39m      [34mexpect[39m(focusableElements)[33m.[39m[34mtoContain[39m(link)

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mFocusable Elements Detection[2m > [22mshould exclude disabled elements
[31m[1mAssertionError[22m: expected [] to have a length of 1 but got +0[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- 1[39m
[31m+ 0[39m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m81:33[22m[39m
    [90m 79| [39m
    [90m 80| [39m      [35mconst[39m focusableElements [33m=[39m [34mgetFocusableElements[39m(container)
    [90m 81| [39m      [34mexpect[39m(focusableElements)[33m.[39m[34mtoHaveLength[39m([34m1[39m)
    [90m   | [39m                                [31m^[39m
    [90m 82| [39m      [34mexpect[39m(focusableElements)[33m.[39m[34mtoContain[39m(enabledButton)
    [90m 83| [39m      [34mexpect[39m(focusableElements)[33m.[39mnot[33m.[39m[34mtoContain[39m(disabledButton)

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mArrow Key Navigation[2m > [22mshould handle arrow down navigation
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m217:23[22m[39m
    [90m215| [39m
    [90m216| [39m      [35mconst[39m handled [33m=[39m [34mhandleArrowKeyNavigation[39m(mockEvent[33m,[39m container)
    [90m217| [39m      [34mexpect[39m(handled)[33m.[39m[34mtoBe[39m([35mtrue[39m)
    [90m   | [39m                      [31m^[39m
    [90m218| [39m
    [90m219| [39m      [90m// Clean up[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mArrow Key Navigation[2m > [22mshould handle arrow up navigation
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m253:23[22m[39m
    [90m251| [39m
    [90m252| [39m      [35mconst[39m handled [33m=[39m [34mhandleArrowKeyNavigation[39m(mockEvent[33m,[39m container)
    [90m253| [39m      [34mexpect[39m(handled)[33m.[39m[34mtoBe[39m([35mtrue[39m)
    [90m   | [39m                      [31m^[39m
    [90m254| [39m
    [90m255| [39m      [90m// Clean up[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mHome/End Navigation[2m > [22mshould handle Home key navigation
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m290:23[22m[39m
    [90m288| [39m
    [90m289| [39m      [35mconst[39m handled [33m=[39m [34mhandleHomeEndNavigation[39m(mockEvent[33m,[39m container)
    [90m290| [39m      [34mexpect[39m(handled)[33m.[39m[34mtoBe[39m([35mtrue[39m)
    [90m   | [39m                      [31m^[39m
    [90m291| [39m      [34mexpect[39m(focusedElement)[33m.[39m[34mtoBe[39m(button1)
    [90m292| [39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mHome/End Navigation[2m > [22mshould handle End key navigation
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m326:23[22m[39m
    [90m324| [39m
    [90m325| [39m      [35mconst[39m handled [33m=[39m [34mhandleHomeEndNavigation[39m(mockEvent[33m,[39m container)
    [90m326| [39m      [34mexpect[39m(handled)[33m.[39m[34mtoBe[39m([35mtrue[39m)
    [90m   | [39m                      [31m^[39m
    [90m327| [39m      [34mexpect[39m(focusedElement)[33m.[39m[34mtoBe[39m(button3)
    [90m328| [39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mSkip Link Navigation[2m > [22mshould handle skip link activation
[31m[1mTypeError[22m: target.scrollIntoView is not a function[39m
[36m [2m❯[22m Object.onClick src/components/ui/RichText/utils/keyboardNavigation.ts:[2m364:16[22m[39m
    [90m362| [39m      [35mif[39m (target) {
    [90m363| [39m        target[33m.[39m[34mfocus[39m()
    [90m364| [39m        target[33m.[39m[34mscrollIntoView[39m({ behavior[33m:[39m [32m'smooth'[39m[33m,[39m block[33m:[39m [32m'start'[39m })
    [90m   | [39m               [31m^[39m
    [90m365| [39m      }
    [90m366| [39m    }[33m,[39m
[90m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m443:21[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mFocus Trap[2m > [22mshould create focus trap with correct methods
[31m[1mAssertionError[22m: expected <button></button> to be <button></button> // Object.is equality

If it should pass with deep equality, replace "toBe" with "toStrictEqual"

Expected: <button></button>
Received: serializes to the same string
[39m

[2mCompared values have no visual difference.[22m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m478:30[22m[39m
    [90m476| [39m      [90m// Test focus methods[39m
    [90m477| [39m      focusTrap[33m.[39m[34mfocusFirst[39m()
    [90m478| [39m      [34mexpect[39m(focusedElement)[33m.[39m[34mtoBe[39m(button1)
    [90m   | [39m                             [31m^[39m
    [90m479| [39m
    [90m480| [39m      focusTrap[33m.[39m[34mfocusLast[39m()

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mRoving Tabindex[2m > [22mshould create roving tabindex with correct methods
[31m[1mAssertionError[22m: expected null to be '0' // Object.is equality[39m

[32m- Expected:[39m 
"0"

[31m+ Received:[39m 
null

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m507:48[22m[39m
    [90m505| [39m      [90m// Test initial state[39m
    [90m506| [39m      [34mexpect[39m(rovingTabindex[33m.[39m[34mgetCurrentIndex[39m())[33m.[39m[34mtoBe[39m([34m0[39m)
    [90m507| [39m      [34mexpect[39m(button1[33m.[39m[34mgetAttribute[39m([32m'tabindex'[39m))[33m.[39m[34mtoBe[39m([32m'0'[39m)
    [90m   | [39m                                               [31m^[39m
    [90m508| [39m      [34mexpect[39m(button2[33m.[39m[34mgetAttribute[39m([32m'tabindex'[39m))[33m.[39m[34mtoBe[39m([32m'-1'[39m)
    [90m509| [39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/28]⎯[22m[39m

[41m[1m FAIL [22m[49m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts[2m > [22mRichText Keyboard Navigation[2m > [22mIntegration Tests[2m > [22mshould handle comprehensive keyboard navigation
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m tests/unit/richtext/richtext-keyboard-navigation.unit.spec.ts:[2m548:23[22m[39m
    [90m546| [39m
    [90m547| [39m      [35mconst[39m handled [33m=[39m [34mhandleKeyboardNavigation[39m(arrowEvent[33m,[39m container)
    [90m548| [39m      [34mexpect[39m(handled)[33m.[39m[34mtoBe[39m([35mtrue[39m)
    [90m   | [39m                      [31m^[39m
    [90m549| [39m
    [90m550| [39m      [90m// Test Home key navigation[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/28]⎯[22m[39m




## Baseline Metrics for Comparison

Use these metrics to compare performance before and after restructuring:

1. **TypeScript Compilation Time**: N/A
2. **Build Time**: N/A
3. **Test Execution Time**: N/A
4. **Bundle Size**: 2.11 GB
5. **Dependency Count**: 66

## Post-Restructuring Validation

After completing the restructuring, run the same performance tests and compare:

- ✅ TypeScript compilation should remain fast or improve
- ✅ Build time should remain similar or improve
- ✅ Test execution should remain similar or improve  
- ✅ Bundle size should remain similar or improve
- ✅ No new dependencies should be added unnecessarily

---

*This baseline provides measurable metrics to ensure the restructuring process maintains or improves performance.*
