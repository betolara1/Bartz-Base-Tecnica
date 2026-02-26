import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    catalogData,
    searchPieces,
    getPiecesByCategory,
    getCategories,
    addPieceToCatalog,
    isUserCreatedPiece
} from '../data/catalog';

describe('Catalog Logic', () => {
    it('should return all categories', () => {
        const categories = getCategories();
        expect(categories).toContain('Ateliê Bartz');
    });

    it('should filter pieces by category', () => {
        const pieces = getPiecesByCategory('Ateliê Bartz');
        expect(pieces.length).toBeGreaterThan(0);
        expect(pieces[0].categoria).toBe('Ateliê Bartz');
    });

    it('should search pieces by description', () => {
        const results = searchPieces('Curvo 90');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].descricao).toContain('Curvo 90');
    });

    it('should search pieces by tags', () => {
        const results = searchPieces('muxarabi');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].tags).toContain('muxarabi');
    });

    it('should add a new piece to the catalog', () => {
        const initialCount = catalogData.length;
        const newPiece = {
            categoria: 'Teste',
            subcategoria: 'Subteste',
            descricao: 'Peça de Teste',
            min: { largura: 100, altura: 100, profundidade: 100 },
            max: { largura: 200, altura: 200, profundidade: 200 },
            fixos: { largura: false, altura: false, profundidade: false },
            popularidade: 1,
            relatedIds: [],
            tags: ['teste']
        };

        const added = addPieceToCatalog(newPiece);
        expect(catalogData.length).toBe(initialCount + 1);
        expect(added.id).toBeDefined();
        expect(isUserCreatedPiece(added.id)).toBe(true);
    });
});
