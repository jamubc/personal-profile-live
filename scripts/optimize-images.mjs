import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public', 'projects');
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

async function* walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            yield* walk(fullPath);
        } else {
            yield fullPath;
        }
    }
}

async function optimizeImage(filePath) {
    const ext = extname(filePath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

    const outPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
    const name = basename(filePath);

    try {
        const metadata = await sharp(filePath).metadata();
        let pipeline = sharp(filePath);

        // Resize if any dimension exceeds MAX_DIMENSION
        if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
            pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outPath);

        const [origStat, newStat] = await Promise.all([stat(filePath), stat(outPath)]);
        const savings = ((1 - newStat.size / origStat.size) * 100).toFixed(1);

        console.log(
            `✓ ${name} → ${basename(outPath)}  ` +
            `${(origStat.size / 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB  ` +
            `(${savings}% smaller)`
        );

        return { original: filePath, size: origStat.size, newSize: newStat.size };
    } catch (err) {
        console.error(`✗ ${name}: ${err.message}`);
        return null;
    }
}

async function main() {
    console.log(`\nOptimizing images in ${PUBLIC_DIR}\n`);
    console.log('─'.repeat(60));

    let totalOriginal = 0;
    let totalNew = 0;
    let count = 0;
    const originals = [];

    for await (const filePath of walk(PUBLIC_DIR)) {
        const result = await optimizeImage(filePath);
        if (result) {
            totalOriginal += result.size;
            totalNew += result.newSize;
            originals.push(result.original);
            count++;
        }
    }

    console.log('─'.repeat(60));
    console.log(`\n${count} images converted to WebP`);
    console.log(`Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalNew / 1024 / 1024).toFixed(1)}MB`);
    console.log(`Saved: ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%\n`);

    // Delete originals
    if (originals.length > 0) {
        console.log('Removing original files...');
        for (const f of originals) {
            await unlink(f);
        }
        console.log(`Deleted ${originals.length} original files.\n`);
    }
}

main().catch(console.error);
