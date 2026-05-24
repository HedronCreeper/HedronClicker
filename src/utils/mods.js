const TEXT_DECODER = new TextDecoder();

function readU16(view, offset) {
  return view.getUint16(offset, true);
}

function readU32(view, offset) {
  return view.getUint32(offset, true);
}

async function inflateRaw(bytes) {
  if (typeof DecompressionStream !== 'function') {
    throw new Error('This browser cannot read compressed zip mods.');
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZipEntries(file) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const entries = {};
  let offset = Math.max(0, buffer.byteLength - 22);

  while (offset >= 0 && readU32(view, offset) !== 0x06054b50) offset--;
  if (offset < 0) throw new Error('Invalid zip file.');

  const entryCount = readU16(view, offset + 10);
  let centralOffset = readU32(view, offset + 16);

  for (let i = 0; i < entryCount; i++) {
    if (centralOffset + 46 > buffer.byteLength || readU32(view, centralOffset) !== 0x02014b50) {
      throw new Error('Invalid zip directory.');
    }

    const method = readU16(view, centralOffset + 10);
    const compressedSize = readU32(view, centralOffset + 20);
    const fileNameLength = readU16(view, centralOffset + 28);
    const extraLength = readU16(view, centralOffset + 30);
    const commentLength = readU16(view, centralOffset + 32);
    const localOffset = readU32(view, centralOffset + 42);
    const nameStart = centralOffset + 46;
    const nameEnd = nameStart + fileNameLength;

    if (readU32(view, localOffset) !== 0x04034b50) throw new Error('Invalid zip entry.');

    const localNameLength = readU16(view, localOffset + 26);
    const localExtraLength = readU16(view, localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const dataEnd = dataStart + compressedSize;

    if (dataEnd > buffer.byteLength) throw new Error('Invalid zip structure.');

    const name = TEXT_DECODER.decode(new Uint8Array(buffer, nameStart, fileNameLength));
    const compressed = new Uint8Array(buffer, dataStart, compressedSize);
    let data;

    if (method === 0) {
      data = compressed;
    } else if (method === 8) {
      data = await inflateRaw(compressed);
    } else {
      throw new Error(`Unsupported zip compression method: ${method}`);
    }

    if (name && !name.endsWith('/')) entries[name] = data;
    centralOffset = nameEnd + extraLength + commentLength;
  }

  return entries;
}

function getEntry(entries, fileName) {
  const match = Object.entries(entries).find(([name]) => {
    const parts = name.split('/').filter(Boolean);
    return parts.length === 2 && !parts[0].startsWith('__') && !parts[0].startsWith('.') && parts[1] === fileName;
  });
  return match?.[1] || null;
}

function parseConfig(text) {
  const mods = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([a-z_]+)\s*:\s*"([^"]+)"\s*$/i);
    if (!match) continue;
    mods[match[1].toLowerCase()] = match[2].trim();
  }
  return mods;
}

function isSafeCssColor(value) {
  if (!value) return false;
  return /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value) || /^[a-z]+$/i.test(value);
}

export async function parseModZip(file) {
  const entries = await readZipEntries(file);
  const configBytes = getEntry(entries, 'config.txt');

  if (!configBytes) throw new Error('Missing config.txt inside the mod folder.');

  const config = parseConfig(TEXT_DECODER.decode(configBytes));
  const keyColor = config.key_colour;
  const pointsColor = config.points_colour;

  if (!isSafeCssColor(keyColor)) {
    throw new Error('config.txt must include key_colour: "green" or another valid CSS color.');
  }

  return {
    active: true,
    keyColor,
    pointsColor: isSafeCssColor(pointsColor) ? pointsColor : null,
    name: file.name.replace(/\.zip$/i, ''),
    importedAt: Date.now(),
  };
}