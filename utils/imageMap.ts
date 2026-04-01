// Vite static asset imports — these are resolved at build time
// so the images work correctly in both dev and production.
import moduloCurvo90 from "../fotos/modulo-curvo-90.png";
import tampo1Lado from "../fotos/tampo-1-lado-arrendodado.png";
import tampo2Lados from "../fotos/tampo-2-lado-arrendodado.png";
import muxarabi from "../fotos/muxarabi.png";
import trianguloRetangulo from "../fotos/triangulo-retangulo.png";
import geometriaCircular from "../fotos/geometria-circular.png";
import geometriaLivre from "../fotos/geometria-livre.png";
import basicLineInferiores from "../fotos/basic-line-inferiores.png";
import basicLineSuperiores from "../fotos/basic-line-superiores.png";

export const pieceImages: Record<string, string> = {
    "mod-curvo-90": moduloCurvo90,
    "tampo-curvo-1side": tampo1Lado,
    "tampo-curvo-2sides": tampo2Lados,
    muxarabi: muxarabi,
    "triangulo-retangulo": trianguloRetangulo,
    "geometria-circular": geometriaCircular,
    "geometria-livre": geometriaLivre,
    "basic-inferiores": basicLineInferiores,
    "basic-superiores": basicLineSuperiores,
};

/** Returns the image URL for a piece ID, or undefined if no image exists. */
export function getPieceImage(id: string): string | undefined {
    return pieceImages[id];
}
