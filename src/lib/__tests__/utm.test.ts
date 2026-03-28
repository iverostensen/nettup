import { describe, it, expect, beforeEach, vi } from 'vitest';

const store = new Map<string, string>();

const mockWindow: Record<string, unknown> = {
  location: { search: '' },
};

vi.stubGlobal('window', mockWindow);
vi.stubGlobal('sessionStorage', {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => { store.set(key, value); },
  removeItem: (key: string) => { store.delete(key); },
  clear: () => { store.clear(); },
  get length() { return store.size; },
  key: (i: number) => [...store.keys()][i] ?? null,
});

describe('utm', () => {
  beforeEach(() => {
    store.clear();
    vi.resetModules();
  });

  describe('captureUtmParams', () => {
    it('captures all 5 UTM params from URL', async () => {
      mockWindow.location = { search: '?utm_source=facebook&utm_medium=cpc&utm_campaign=spring&utm_content=video1&utm_term=nettside' };
      const { captureUtmParams } = await import('../utm');
      captureUtmParams();
      expect(store.get('utm_source')).toBe('facebook');
      expect(store.get('utm_medium')).toBe('cpc');
      expect(store.get('utm_campaign')).toBe('spring');
      expect(store.get('utm_content')).toBe('video1');
      expect(store.get('utm_term')).toBe('nettside');
    });

    it('captures only present params', async () => {
      mockWindow.location = { search: '?utm_source=facebook&utm_content=ad1' };
      const { captureUtmParams } = await import('../utm');
      captureUtmParams();
      expect(store.get('utm_source')).toBe('facebook');
      expect(store.get('utm_content')).toBe('ad1');
      expect(store.has('utm_medium')).toBe(false);
    });
  });

  describe('getUtmParams', () => {
    it('returns all stored UTM params', async () => {
      store.set('utm_source', 'facebook');
      store.set('utm_medium', 'cpc');
      store.set('utm_campaign', 'spring');
      store.set('utm_content', 'video1');
      store.set('utm_term', 'nettside');
      const { getUtmParams } = await import('../utm');
      const result = getUtmParams();
      expect(result).toEqual({
        utm_source: 'facebook',
        utm_medium: 'cpc',
        utm_campaign: 'spring',
        utm_content: 'video1',
        utm_term: 'nettside',
      });
    });

    it('omits params without stored values', async () => {
      store.set('utm_source', 'google');
      const { getUtmParams } = await import('../utm');
      const result = getUtmParams();
      expect(result).toEqual({ utm_source: 'google' });
      expect(result).not.toHaveProperty('utm_content');
      expect(result).not.toHaveProperty('utm_term');
    });
  });
});
