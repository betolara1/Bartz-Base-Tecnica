import { describe, it, expect, beforeEach } from 'vitest';
import { formatTimeAgo } from '../utils/history';

describe('History Utils', () => {
    it('should format "just now"', () => {
        const now = Date.now();
        expect(formatTimeAgo(now)).toBe('agora há pouco');
    });

    it('should format minutes ago', () => {
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        expect(formatTimeAgo(fiveMinutesAgo)).toBe('5min atrás');
    });

    it('should format hours ago', () => {
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        expect(formatTimeAgo(twoHoursAgo)).toBe('2h atrás');
    });

    it('should format days ago', () => {
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        expect(formatTimeAgo(threeDaysAgo)).toBe('3d atrás');
    });
});
