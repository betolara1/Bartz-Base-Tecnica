// Auto-discovers all .gif files inside /videos/ using Vite's import.meta.glob.
// To add a new GIF tutorial for a piece:
//   1. Drop the .gif file into /videos/
//   2. Name it EXACTLY like the piece ID (e.g., muxarabi.gif for pieceId='muxarabi')
//   3. (Optional) If it has a different name, map it in pieceToGifFilename below.
// No other code changes required whatsoever!

const allGifs = import.meta.glob<{ default: string }>("../videos/*.gif", { eager: true });

/**
 * Maps piece IDs to their GIF filenames (can be a string or array).
 */
export const pieceToGifFilename: Record<string, string | string[]> = {
    "mod-curvo-90": "modulo-curvo-90",
    "tampo-curvo-1side": "tampo-1-lado-arrendodado",
    "tampo-curvo-2sides": "tampo-2-lado-arrendodado",
    "muxarabi": "muxarabi",
    "triangulo-retangulo": "triangulo-retangulo",
    "geometria-circular": "geometria-circular",
    "geometria-livre": ["como-usar-geometria-livre", "geometria-livre", "curvas-geometria-livre"],
    "basic-inferiores": "linha-basic-inferiores",
};

/**
 * Returns all resolved URLs for a piece's GIFs.
 */
export function getPieceVideos(pieceId: string): string[] {
    const urls: string[] = [];
    let mappings = pieceToGifFilename[pieceId] || [pieceId];
    if (!Array.isArray(mappings)) mappings = [mappings];

    // Try each mapping
    for (const filename of mappings) {
        const key = `../videos/${filename}.gif`;
        const resolved = allGifs[key]?.default;
        if (resolved) urls.push(resolved);
    }

    // Also look for any GIF that simply contains the pieceId in its name (if not already found)
    if (urls.length === 0) {
        for (const [path, module] of Object.entries(allGifs)) {
            if (path.toLowerCase().includes(pieceId.toLowerCase())) {
                urls.push(module.default);
            }
        }
    }

    return urls;
}
