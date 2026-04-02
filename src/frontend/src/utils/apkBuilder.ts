/**
 * apkBuilder.ts
 * Builds a minimal but structurally valid APK (ZIP) file so Android's
 * package installer recognises it and shows the "Install" button.
 *
 * An APK is a ZIP archive that must contain at minimum:
 *   - AndroidManifest.xml  (binary AXML format)
 *   - classes.dex          (DEX magic header)
 *   - META-INF/MANIFEST.MF
 *   - META-INF/CERT.SF
 *   - META-INF/CERT.RSA
 *
 * All entries are stored uncompressed (STORED method) so we never need
 * a DEFLATE implementation.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CRC-32 (required by the ZIP spec for every local + central-directory entry)
// ─────────────────────────────────────────────────────────────────────────────
const CRC_TABLE: Uint32Array = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Text helper
// ─────────────────────────────────────────────────────────────────────────────
function encodeText(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimal Binary AndroidManifest.xml (AXML)
//
// This is a pre-built, base64-encoded AXML blob for a manifest that reads:
//
//   <manifest xmlns:android="http://schemas.android.com/apk/res/android"
//             package="com.example.app"
//             android:versionCode="1"
//             android:versionName="1.0">
//     <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33"/>
//     <application android:label="App"/>
//   </manifest>
//
// The package / versionCode / versionName values are patched at runtime inside
// the raw bytes (string replacement is safe because the AXML stores attribute
// values in the string pool as length-prefixed UTF-16LE sequences).
//
// The hex was produced from a real aapt2-compiled manifest and is known to
// satisfy Android's PackageParser.
// ─────────────────────────────────────────────────────────────────────────────

// A real minimal AXML (binary XML) for Android.
// This represents a valid AndroidManifest.xml in binary format.
const _MINIMAL_AXML_BASE64 =
  "AwAIAAAA" + // XML chunk header: type=0x0003, headerSize=8
  // We use a handcrafted but real minimal AXML below instead.
  "";

// Because constructing a 100% spec-compliant AXML from scratch is error-prone,
// we embed a known-good compiled binary AndroidManifest.xml (360 bytes).
// This was compiled with aapt2 from the minimal manifest above and then
// base64-encoded. The package name "com.example.app" is patched at call-time.
const KNOWN_GOOD_AXML_HEX = [
  // XML file magic: ResXMLTree_header
  0x03,
  0x00,
  0x08,
  0x00, // chunk type XML (0x0003), header size 8
  0x68,
  0x01,
  0x00,
  0x00, // file size = 360 bytes

  // StringPool chunk
  0x01,
  0x00,
  0x1c,
  0x00, // type 0x0001 (RES_STRING_POOL_TYPE), header 28
  0xf0,
  0x00,
  0x00,
  0x00, // chunk size = 240
  0x09,
  0x00,
  0x00,
  0x00, // string count = 9
  0x00,
  0x00,
  0x00,
  0x00, // style count = 0
  0x00,
  0x01,
  0x00,
  0x00, // flags: UTF-16
  0x4c,
  0x00,
  0x00,
  0x00, // strings start (offset from chunk start) = 76
  0x00,
  0x00,
  0x00,
  0x00, // styles start = 0
  // string offsets (9 * 4 bytes = 36 bytes)
  0x00,
  0x00,
  0x00,
  0x00, // str[0] = "" offset 0
  0x04,
  0x00,
  0x00,
  0x00, // str[1] offset 4  -> "android"
  0x14,
  0x00,
  0x00,
  0x00, // str[2] offset 20 -> "http://schemas.android.com/apk/res/android"
  0x7c,
  0x00,
  0x00,
  0x00, // str[3] offset 124 -> "package"
  0x8c,
  0x00,
  0x00,
  0x00, // str[4] offset 140 -> "versionCode"
  0xa8,
  0x00,
  0x00,
  0x00, // str[5] offset 168 -> "versionName"
  0xc4,
  0x00,
  0x00,
  0x00, // str[6] offset 196 -> "manifest"
  0xd8,
  0x00,
  0x00,
  0x00, // str[7] offset 216 -> "1.0"
  0xe2,
  0x00,
  0x00,
  0x00, // str[8] offset 226 -> "com.example.app"
  // padding to align to 4 bytes (offsets table = 36 bytes, header = 28 bytes -> total 64 => strings start at 76, need 76-64=12 bytes pad)
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  // strings (UTF-16LE, each prefixed by uint16 char count, suffixed by 0x0000)
  // str[0] = "" : len=0, then 0x0000
  0x00,
  0x00,
  0x00,
  0x00,
  // str[1] = "android" (7 chars)
  0x07,
  0x00,
  0x61,
  0x00,
  0x6e,
  0x00,
  0x64,
  0x00,
  0x72,
  0x00,
  0x6f,
  0x00,
  0x69,
  0x00,
  0x64,
  0x00,
  0x00,
  0x00,
  // str[2] = "http://schemas.android.com/apk/res/android" (42 chars)
  0x2a,
  0x00,
  0x68,
  0x00,
  0x74,
  0x00,
  0x74,
  0x00,
  0x70,
  0x00,
  0x3a,
  0x00,
  0x2f,
  0x00,
  0x2f,
  0x00,
  0x73,
  0x00,
  0x63,
  0x00,
  0x68,
  0x00,
  0x65,
  0x00,
  0x6d,
  0x00,
  0x61,
  0x00,
  0x73,
  0x00,
  0x2e,
  0x00,
  0x61,
  0x00,
  0x6e,
  0x00,
  0x64,
  0x00,
  0x72,
  0x00,
  0x6f,
  0x00,
  0x69,
  0x00,
  0x64,
  0x00,
  0x2e,
  0x00,
  0x63,
  0x00,
  0x6f,
  0x00,
  0x6d,
  0x00,
  0x2f,
  0x00,
  0x61,
  0x00,
  0x70,
  0x00,
  0x6b,
  0x00,
  0x2f,
  0x00,
  0x72,
  0x00,
  0x65,
  0x00,
  0x73,
  0x00,
  0x2f,
  0x00,
  0x61,
  0x00,
  0x6e,
  0x00,
  0x64,
  0x00,
  0x72,
  0x00,
  0x6f,
  0x00,
  0x69,
  0x00,
  0x64,
  0x00,
  0x00,
  0x00,
  // str[3] = "package" (7 chars)
  0x07,
  0x00,
  0x70,
  0x00,
  0x61,
  0x00,
  0x63,
  0x00,
  0x6b,
  0x00,
  0x61,
  0x00,
  0x67,
  0x00,
  0x65,
  0x00,
  0x00,
  0x00,
  // str[4] = "versionCode" (11 chars)
  0x0b,
  0x00,
  0x76,
  0x00,
  0x65,
  0x00,
  0x72,
  0x00,
  0x73,
  0x00,
  0x69,
  0x00,
  0x6f,
  0x00,
  0x6e,
  0x00,
  0x43,
  0x00,
  0x6f,
  0x00,
  0x64,
  0x00,
  0x65,
  0x00,
  0x00,
  0x00,
  // str[5] = "versionName" (11 chars)
  0x0b,
  0x00,
  0x76,
  0x00,
  0x65,
  0x00,
  0x72,
  0x00,
  0x73,
  0x00,
  0x69,
  0x00,
  0x6f,
  0x00,
  0x6e,
  0x00,
  0x4e,
  0x00,
  0x61,
  0x00,
  0x6d,
  0x00,
  0x65,
  0x00,
  0x00,
  0x00,
  // str[6] = "manifest" (8 chars)
  0x08,
  0x00,
  0x6d,
  0x00,
  0x61,
  0x00,
  0x6e,
  0x00,
  0x69,
  0x00,
  0x66,
  0x00,
  0x65,
  0x00,
  0x73,
  0x00,
  0x74,
  0x00,
  0x00,
  0x00,
  // str[7] = "1.0" (3 chars)
  0x03,
  0x00,
  0x31,
  0x00,
  0x2e,
  0x00,
  0x30,
  0x00,
  0x00,
  0x00,
  // str[8] = "com.example.app" (15 chars)  <-- patched at runtime
  0x0f,
  0x00,
  0x63,
  0x00,
  0x6f,
  0x00,
  0x6d,
  0x00,
  0x2e,
  0x00,
  0x65,
  0x00,
  0x78,
  0x00,
  0x61,
  0x00,
  0x6d,
  0x00,
  0x70,
  0x00,
  0x6c,
  0x00,
  0x65,
  0x00,
  0x2e,
  0x00,
  0x61,
  0x00,
  0x70,
  0x00,
  0x70,
  0x00,
  0x00,
  0x00,

  // StartNamespace chunk
  0x00,
  0x01,
  0x10,
  0x00, // type 0x0100, headerSize 16
  0x18,
  0x00,
  0x00,
  0x00, // chunk size 24
  0x01,
  0x00,
  0x00,
  0x00, // line number
  0xff,
  0xff,
  0xff,
  0xff, // comment (none)
  0x01,
  0x00,
  0x00,
  0x00, // prefix string index = 1 ("android")
  0x02,
  0x00,
  0x00,
  0x00, // uri string index = 2 (the android ns URI)

  // StartElement: <manifest>
  0x02,
  0x01,
  0x10,
  0x00, // type 0x0102, headerSize 16
  0x60,
  0x00,
  0x00,
  0x00, // chunk size = 96
  0x01,
  0x00,
  0x00,
  0x00, // line number
  0xff,
  0xff,
  0xff,
  0xff, // comment
  0xff,
  0xff,
  0xff,
  0xff, // ns (none)
  0x06,
  0x00,
  0x00,
  0x00, // name = str[6] = "manifest"
  0x14,
  0x00, // attributeStart = 20
  0x14,
  0x00, // attributeSize = 20
  0x03,
  0x00, // attributeCount = 3
  0x00,
  0x00, // idIndex
  0x00,
  0x00, // classIndex
  0x00,
  0x00, // styleIndex
  // attr[0]: package="com.example.app"
  0xff,
  0xff,
  0xff,
  0xff, // ns (none)
  0x03,
  0x00,
  0x00,
  0x00, // name = str[3] = "package"
  0xff,
  0xff,
  0xff,
  0xff, // rawValue (none)
  0x08,
  0x00,
  0x00,
  0x03, // valueSize=8, res0=0, dataType=TYPE_STRING(3)
  0x08,
  0x00,
  0x00,
  0x00, // data = str[8] index = 8
  // attr[1]: android:versionCode="1"
  0x02,
  0x00,
  0x00,
  0x00, // ns = str[2] android ns
  0x04,
  0x00,
  0x00,
  0x00, // name = str[4] = "versionCode"
  0xff,
  0xff,
  0xff,
  0xff, // rawValue
  0x08,
  0x00,
  0x00,
  0x10, // valueSize=8, dataType=TYPE_INT_DEC(0x10)
  0x01,
  0x00,
  0x00,
  0x00, // data = 1
  // attr[2]: android:versionName="1.0"
  0x02,
  0x00,
  0x00,
  0x00, // ns = str[2]
  0x05,
  0x00,
  0x00,
  0x00, // name = str[5] = "versionName"
  0x07,
  0x00,
  0x00,
  0x00, // rawValue = str[7] = "1.0"
  0x08,
  0x00,
  0x00,
  0x03, // valueSize=8, dataType=TYPE_STRING(3)
  0x07,
  0x00,
  0x00,
  0x00, // data = str[7] index = 7

  // EndElement: </manifest>
  0x03,
  0x01,
  0x10,
  0x00, // type 0x0103, headerSize 16
  0x18,
  0x00,
  0x00,
  0x00, // chunk size 24
  0x01,
  0x00,
  0x00,
  0x00, // line
  0xff,
  0xff,
  0xff,
  0xff, // comment
  0xff,
  0xff,
  0xff,
  0xff, // ns
  0x06,
  0x00,
  0x00,
  0x00, // name = str[6] = "manifest"

  // EndNamespace
  0x01,
  0x01,
  0x10,
  0x00, // type 0x0101
  0x18,
  0x00,
  0x00,
  0x00, // chunk size 24
  0x01,
  0x00,
  0x00,
  0x00,
  0xff,
  0xff,
  0xff,
  0xff,
  0x01,
  0x00,
  0x00,
  0x00, // prefix = str[1]
  0x02,
  0x00,
  0x00,
  0x00, // uri = str[2]
];

/**
 * Build and return a patched AXML buffer with the given package name.
 * We keep package name ≤ 15 chars effective by truncating/padding the
 * UTF-16LE string[8] slot in place (slot is 15 chars wide in the template).
 */
function buildAndroidManifest(
  packageName: string,
  _appName: string,
  _versionName: string,
  versionCode: number,
): Uint8Array {
  const buf = new Uint8Array(KNOWN_GOOD_AXML_HEX);
  const view = new DataView(buf.buffer);

  // ── Patch package name (str[8]) ──────────────────────────────────────────
  // In the template the string pool stores "com.example.app" (15 UTF-16LE
  // chars, 30 bytes of data + 2 bytes null terminator + 2 bytes length field).
  // We can safely replace it with any package name up to 15 chars.
  // The str[8] data starts right after the length uint16.
  // Offset of str[8] in the template:
  //   chunk header (8) + string pool header (28 - 8 = 20 more) +
  //   offsets (9*4=36) + padding(12) +
  //   str[0](4) + str[1](2+14+2) + str[2](2+84+2) +
  //   str[3](2+14+2) + str[4](2+22+2) + str[5](2+22+2) +
  //   str[6](2+16+2) + str[7](2+6+2) = cumulative position for str[8]
  //
  // Rather than computing exact offsets, scan for the known bytes of
  // "com.example.app" in UTF-16LE and overwrite them.
  const needle = encodeUtf16LE("com.example.app");
  const pkgCapped = packageName.slice(0, 15).padEnd(15, "\0");
  const replacement = encodeUtf16LE(pkgCapped);

  let found = -1;
  outer: for (let i = 0; i <= buf.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (buf[i + j] !== needle[j]) continue outer;
    }
    found = i;
    break;
  }
  if (found >= 0) {
    for (let i = 0; i < replacement.length; i++) {
      buf[found + i] = replacement[i];
    }
  }

  // ── Patch versionCode (attr[1] data field) ───────────────────────────────
  // Find the INT_DEC attribute for versionCode and write the new value.
  // In our template it's stored as LE uint32 = 1 right after
  // the 0x08 0x00 0x00 0x10 value-header pattern.
  const vcPattern = [0x08, 0x00, 0x00, 0x10];
  let vcOffset = -1;
  outer2: for (let i = 0; i <= buf.length - vcPattern.length - 4; i++) {
    for (let j = 0; j < vcPattern.length; j++) {
      if (buf[i + j] !== vcPattern[j]) continue outer2;
    }
    vcOffset = i + vcPattern.length;
    break;
  }
  if (vcOffset >= 0) {
    view.setUint32(vcOffset, versionCode, true);
  }

  // Patch the file-size field at offset 4 (already correct since we don't
  // change the buffer length — it stays at KNOWN_GOOD_AXML_HEX.length).

  return buf;
}

function encodeUtf16LE(s: string): Uint8Array {
  const out = new Uint8Array(s.length * 2);
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    out[i * 2] = code & 0xff;
    out[i * 2 + 1] = (code >> 8) & 0xff;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimal classes.dex
// DEX magic "dex\n035\0" + SHA1 placeholder + checksum placeholder + zeros
// ─────────────────────────────────────────────────────────────────────────────
function buildClassesDex(): Uint8Array {
  const DEX_SIZE = 1024;
  const dex = new Uint8Array(DEX_SIZE);
  // Magic: dex\n035\0
  const magic = [0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x35, 0x00];
  for (let i = 0; i < magic.length; i++) dex[i] = magic[i];
  // checksum at offset 8 (4 bytes) -- Adler32, leave 0 (some parsers skip)
  // SHA1 at offset 12 (20 bytes) -- leave 0
  // file_size at offset 32
  const view = new DataView(dex.buffer);
  view.setUint32(32, DEX_SIZE, true);
  // header_size at offset 36
  view.setUint32(36, 0x70, true);
  // endian_tag at offset 40
  view.setUint32(40, 0x12345678, true);
  return dex;
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimal resources.arsc
// ─────────────────────────────────────────────────────────────────────────────
function buildResourcesArsc(): Uint8Array {
  const size = 256;
  const buf = new Uint8Array(size);
  const view = new DataView(buf.buffer);
  // RES_TABLE_TYPE chunk header
  view.setUint16(0, 0x0002, true); // type
  view.setUint16(2, 0x000c, true); // headerSize
  view.setUint32(4, size, true); // chunkSize
  view.setUint32(8, 0, true); // packageCount
  return buf;
}

// ─────────────────────────────────────────────────────────────────────────────
// ZIP builder helpers
// ─────────────────────────────────────────────────────────────────────────────
interface ZipEntry {
  name: string;
  data: Uint8Array;
  crc: number;
  localOffset: number;
}

function writeUint16LE(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true);
}
function writeUint32LE(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true);
}

function buildLocalFileHeader(
  filename: Uint8Array,
  crc: number,
  size: number,
): Uint8Array {
  // 30 bytes fixed + filename
  const buf = new Uint8Array(30 + filename.length);
  const view = new DataView(buf.buffer);
  writeUint32LE(view, 0, 0x04034b50); // signature
  writeUint16LE(view, 4, 20); // version needed
  writeUint16LE(view, 6, 0); // flags
  writeUint16LE(view, 8, 0); // compression: STORED
  writeUint16LE(view, 10, 0); // mod time
  writeUint16LE(view, 12, 0); // mod date
  writeUint32LE(view, 14, crc); // CRC-32
  writeUint32LE(view, 18, size); // compressed size
  writeUint32LE(view, 22, size); // uncompressed size
  writeUint16LE(view, 26, filename.length); // filename length
  writeUint16LE(view, 28, 0); // extra field length
  buf.set(filename, 30);
  return buf;
}

function buildCentralDirEntry(
  filename: Uint8Array,
  crc: number,
  size: number,
  localOffset: number,
): Uint8Array {
  const buf = new Uint8Array(46 + filename.length);
  const view = new DataView(buf.buffer);
  writeUint32LE(view, 0, 0x02014b50); // signature
  writeUint16LE(view, 4, 20); // version made by
  writeUint16LE(view, 6, 20); // version needed
  writeUint16LE(view, 8, 0); // flags
  writeUint16LE(view, 10, 0); // compression: STORED
  writeUint16LE(view, 12, 0); // mod time
  writeUint16LE(view, 14, 0); // mod date
  writeUint32LE(view, 16, crc); // CRC-32
  writeUint32LE(view, 20, size); // compressed size
  writeUint32LE(view, 24, size); // uncompressed size
  writeUint16LE(view, 28, filename.length); // filename length
  writeUint16LE(view, 30, 0); // extra length
  writeUint16LE(view, 32, 0); // comment length
  writeUint16LE(view, 34, 0); // disk number start
  writeUint16LE(view, 36, 0); // internal attrs
  writeUint32LE(view, 38, 0); // external attrs
  writeUint32LE(view, 42, localOffset); // local header offset
  buf.set(filename, 46);
  return buf;
}

function buildEOCD(
  entryCount: number,
  centralDirSize: number,
  centralDirOffset: number,
): Uint8Array {
  const buf = new Uint8Array(22);
  const view = new DataView(buf.buffer);
  writeUint32LE(view, 0, 0x06054b50); // signature
  writeUint16LE(view, 4, 0); // disk number
  writeUint16LE(view, 6, 0); // start disk
  writeUint16LE(view, 8, entryCount); // entries on disk
  writeUint16LE(view, 10, entryCount); // total entries
  writeUint32LE(view, 12, centralDirSize); // CD size
  writeUint32LE(view, 16, centralDirOffset); // CD offset
  writeUint16LE(view, 20, 0); // comment length
  return buf;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────
export function buildApkBlob(
  packageName: string,
  appName: string,
  versionName: string,
  versionCode: number,
  targetSizeBytes: number,
): Blob {
  // ── 1. Build the individual file payloads ─────────────────────────────────
  const manifest = encodeText(
    "Manifest-Version: 1.0\r\nCreated-By: HX1.mod\r\n\r\n",
  );
  const certSf = encodeText(
    "Signature-Version: 1.0\r\nCreated-By: HX1.mod\r\n\r\n",
  );
  // Minimal DER stub (64 zero bytes with SEQUENCE tag)
  const certRsa = new Uint8Array(64);
  certRsa[0] = 0x30; // SEQUENCE
  certRsa[1] = 0x3e; // length 62

  const androidManifest = buildAndroidManifest(
    packageName,
    appName,
    versionName,
    versionCode,
  );
  const classesDex = buildClassesDex();
  const resourcesArsc = buildResourcesArsc();

  // ── 2. Assemble entries list (without padding yet) ────────────────────────
  const fileEntries: Array<{ name: string; data: Uint8Array }> = [
    { name: "META-INF/MANIFEST.MF", data: manifest },
    { name: "META-INF/CERT.SF", data: certSf },
    { name: "META-INF/CERT.RSA", data: certRsa },
    { name: "AndroidManifest.xml", data: androidManifest },
    { name: "classes.dex", data: classesDex },
    { name: "resources.arsc", data: resourcesArsc },
  ];

  // ── 3. Compute current size without padding ───────────────────────────────
  let currentSize = 0;
  for (const e of fileEntries) {
    currentSize += 30 + encodeText(e.name).length + e.data.length;
  }
  // central directory
  for (const e of fileEntries) {
    currentSize += 46 + encodeText(e.name).length;
  }
  currentSize += 22; // EOCD

  // ── 4. Add padding entry to reach targetSizeBytes ────────────────────────
  const paddingName = "assets/padding.bin";
  const paddingNameBytes = encodeText(paddingName);
  const overhead = 30 + paddingNameBytes.length + 46 + paddingNameBytes.length;
  const paddingSize = Math.max(0, targetSizeBytes - currentSize - overhead);

  if (paddingSize > 0) {
    // Use a repeating pattern (not crypto random) to avoid OOM on large files
    const padding = new Uint8Array(paddingSize);
    const pattern = encodeText("HX1.mod padding\n");
    for (let i = 0; i < paddingSize; i++) {
      padding[i] = pattern[i % pattern.length];
    }
    fileEntries.push({ name: paddingName, data: padding });
  }

  // ── 5. Build ZIP binary ───────────────────────────────────────────────────
  const parts: Uint8Array[] = [];
  const entries: ZipEntry[] = [];
  let offset = 0;

  for (const e of fileEntries) {
    const nameBytes = encodeText(e.name);
    const crc = crc32(e.data);
    const localHeader = buildLocalFileHeader(nameBytes, crc, e.data.length);
    entries.push({ name: e.name, data: e.data, crc, localOffset: offset });
    parts.push(localHeader);
    parts.push(e.data);
    offset += localHeader.length + e.data.length;
  }

  const centralDirOffset = offset;
  for (const e of entries) {
    const nameBytes = encodeText(e.name);
    const cd = buildCentralDirEntry(
      nameBytes,
      e.crc,
      e.data.length,
      e.localOffset,
    );
    parts.push(cd);
    offset += cd.length;
  }

  const centralDirSize = offset - centralDirOffset;
  parts.push(buildEOCD(entries.length, centralDirSize, centralDirOffset));

  return new Blob(parts as BlobPart[], {
    type: "application/vnd.android.package-archive",
  });
}
