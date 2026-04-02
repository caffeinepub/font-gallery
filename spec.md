# HX1.mod

## Current State
The app generates APK files using `crypto.getRandomValues` to fill a byte buffer, then downloads it as `.apk`. This produces a file that looks like an APK by name and MIME type, but has no valid internal structure -- it is random bytes. Android cannot parse it, so the system does not offer an Install option.

## Requested Changes (Diff)

### Add
- A proper minimal APK builder function that generates a ZIP-structured file with:
  - `META-INF/MANIFEST.MF` (valid manifest)
  - `META-INF/CERT.SF` (signature file stub)
  - `META-INF/CERT.RSA` (certificate placeholder)
  - `AndroidManifest.xml` (binary XML with package name, version, min SDK)
  - `classes.dex` (minimal valid DEX file stub with correct magic bytes)
  - `res/` and `resources.arsc` stubs
- The ZIP file must use correct local file headers, central directory, and end-of-central-directory records so Android's package installer can parse and recognize it
- Package name derived from game name (e.g. `com.hx1mod.carxstreet`)

### Modify
- `triggerApkDownload()` in `GameModal.tsx` -- replace random byte generation with the proper APK ZIP builder
- `downloadHX1App()` in `App.tsx` -- replace random byte generation with the proper APK ZIP builder for the HX1 app itself

### Remove
- Random byte filling as the sole APK content

## Implementation Plan
1. Create `src/frontend/src/utils/apkBuilder.ts` -- exports `buildApkBlob(packageName: string, appName: string, versionName: string, targetSizeBytes: number): Blob` that builds a ZIP-structured APK
2. The builder manually constructs ZIP local file headers + data for each entry, then the ZIP central directory + EOCD
3. After all real entries, pad the `classes.dex` or a `assets/padding.bin` entry to reach the target file size
4. Update `GameModal.tsx` to import and use `buildApkBlob`
5. Update `App.tsx` to import and use `buildApkBlob` for the HX1 app download
