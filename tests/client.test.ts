import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FredClient, FredError } from '../src/index';

// ─── Mock fetch globally ───────────────────────────────────────────────────

const mockFetch = vi.fn();

function makeMockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function createClient(): FredClient {
  return new FredClient({ apiKey: 'test-api-key', fetch: mockFetch });
}

function captureUrl(): URL {
  const call = mockFetch.mock.calls[0] as [string, RequestInit];
  return new URL(call[0]);
}

// ─── Tests ────────────────────────────────────────────────────────────────

describe('FredClient', () => {
  beforeEach(() => mockFetch.mockReset());

  // ── Constructor ──────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('throws if apiKey is empty', () => {
      expect(() => new FredClient({ apiKey: '' })).toThrow('FredClient requires a non-empty apiKey.');
    });

    it('throws if apiKey is whitespace', () => {
      expect(() => new FredClient({ apiKey: '   ' })).toThrow();
    });

    it('creates client with valid apiKey', () => {
      expect(() => createClient()).not.toThrow();
    });

    it('exposes all API namespaces', () => {
      const client = createClient();
      expect(client.categories).toBeDefined();
      expect(client.releases).toBeDefined();
      expect(client.series).toBeDefined();
      expect(client.sources).toBeDefined();
      expect(client.tags).toBeDefined();
      expect(client.maps).toBeDefined();
      expect(client.v2).toBeDefined();
    });
  });

  // ── HTTP Layer ───────────────────────────────────────────────────────────

  describe('HTTP layer', () => {
    it('appends api_key and file_type to every request', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ categories: [] }));
      const client = createClient();
      await client.categories.getCategory({ category_id: 0 });
      const url = captureUrl();
      expect(url.searchParams.get('api_key')).toBe('test-api-key');
      expect(url.searchParams.get('file_type')).toBe('json');
    });

    it('throws FredError on non-OK HTTP response', async () => {
      mockFetch.mockResolvedValueOnce(
        makeMockResponse({ error_code: 400, error_message: 'Bad Request' }, 400),
      );
      const client = createClient();
      await expect(client.categories.getCategory({ category_id: -1 })).rejects.toBeInstanceOf(FredError);
    });

    it('throws FredError with correct code on API error', async () => {
      mockFetch.mockResolvedValueOnce(
        makeMockResponse({ error_code: 404, error_message: 'Not Found' }, 404),
      );
      const client = createClient();
      await expect(client.series.getSeries({ series_id: 'INVALID' })).rejects.toMatchObject({
        code: 404,
        status: 404,
      });
    });

    it('throws FredError on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const client = createClient();
      await expect(client.tags.getTags()).rejects.toBeInstanceOf(FredError);
    });

    it('uses custom baseUrl if provided', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ categories: [] }));
      const client = new FredClient({
        apiKey: 'test-key',
        baseUrl: 'https://custom.example.com',
        fetch: mockFetch,
      });
      await client.categories.getCategory({ category_id: 0 });
      const url = captureUrl();
      expect(url.hostname).toBe('custom.example.com');
    });
  });

  // ── Categories API ───────────────────────────────────────────────────────

  describe('categories', () => {
    const categoryPayload = { categories: [{ id: 125, name: 'Trade Balance', parent_id: 13 }] };

    it('getCategory — calls correct endpoint with category_id', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse(categoryPayload));
      const client = createClient();
      const result = await client.categories.getCategory({ category_id: 125 });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/category');
      expect(url.searchParams.get('category_id')).toBe('125');
      expect(result.categories[0]?.id).toBe(125);
    });

    it('getCategoryChildren — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse(categoryPayload));
      const client = createClient();
      await client.categories.getCategoryChildren({ category_id: 13 });
      expect(captureUrl().pathname).toBe('/fred/category/children');
    });

    it('getCategoryRelated — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse(categoryPayload));
      const client = createClient();
      await client.categories.getCategoryRelated({ category_id: 32073 });
      expect(captureUrl().pathname).toBe('/fred/category/related');
    });

    it('getCategorySeries — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ seriess: [], count: 0, offset: 0, limit: 1000 }));
      const client = createClient();
      await client.categories.getCategorySeries({ category_id: 125 });
      expect(captureUrl().pathname).toBe('/fred/category/series');
    });

    it('getCategoryTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [], count: 0, offset: 0, limit: 1000 }));
      const client = createClient();
      await client.categories.getCategoryTags({ category_id: 125 });
      expect(captureUrl().pathname).toBe('/fred/category/tags');
    });

    it('getCategoryRelatedTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      const client = createClient();
      await client.categories.getCategoryRelatedTags({ category_id: 125, tag_names: 'nation' });
      expect(captureUrl().pathname).toBe('/fred/category/related_tags');
    });
  });

  // ── Releases API ─────────────────────────────────────────────────────────

  describe('releases', () => {
    it('getReleases — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ releases: [], count: 0, offset: 0, limit: 1000 }));
      await createClient().releases.getReleases();
      expect(captureUrl().pathname).toBe('/fred/releases');
    });

    it('getAllReleaseDates — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ release_dates: [] }));
      await createClient().releases.getAllReleaseDates();
      expect(captureUrl().pathname).toBe('/fred/releases/dates');
    });

    it('getRelease — calls correct endpoint with release_id', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ releases: [] }));
      await createClient().releases.getRelease({ release_id: 53 });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/release');
      expect(url.searchParams.get('release_id')).toBe('53');
    });

    it('getReleaseDates — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ release_dates: [] }));
      await createClient().releases.getReleaseDates({ release_id: 53 });
      expect(captureUrl().pathname).toBe('/fred/release/dates');
    });

    it('getReleaseSeries — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ seriess: [] }));
      await createClient().releases.getReleaseSeries({ release_id: 53 });
      expect(captureUrl().pathname).toBe('/fred/release/series');
    });

    it('getReleaseSources — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ sources: [] }));
      await createClient().releases.getReleaseSources({ release_id: 53 });
      expect(captureUrl().pathname).toBe('/fred/release/sources');
    });

    it('getReleaseTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      await createClient().releases.getReleaseTags({ release_id: 53 });
      expect(captureUrl().pathname).toBe('/fred/release/tags');
    });

    it('getReleaseRelatedTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      await createClient().releases.getReleaseRelatedTags({ release_id: 53, tag_names: 'nation' });
      expect(captureUrl().pathname).toBe('/fred/release/related_tags');
    });

    it('getReleaseTables — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ elements: {} }));
      await createClient().releases.getReleaseTables({ release_id: 53 });
      expect(captureUrl().pathname).toBe('/fred/release/tables');
    });
  });

  // ── Series API ───────────────────────────────────────────────────────────

  describe('series', () => {
    const seriesPayload = {
      seriess: [{ id: 'GNPCA', title: 'Real Gross National Product' }],
    };
    const obsPayload = {
      observations: [{ date: '2024-01-01', value: '27357.0' }],
      count: 1,
    };

    it('getSeries — calls correct endpoint with series_id', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse(seriesPayload));
      const result = await createClient().series.getSeries({ series_id: 'GNPCA' });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/series');
      expect(url.searchParams.get('series_id')).toBe('GNPCA');
      expect(result.seriess[0]).toBeDefined();
    });

    it('getSeriesCategories — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ categories: [] }));
      await createClient().series.getSeriesCategories({ series_id: 'GNPCA' });
      expect(captureUrl().pathname).toBe('/fred/series/categories');
    });

    it('getSeriesObservations — calls correct endpoint and returns observations', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse(obsPayload));
      const result = await createClient().series.getSeriesObservations({ series_id: 'GDP' });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/series/observations');
      expect(result.observations[0]?.value).toBe('27357.0');
    });

    it('getSeriesObservations — passes optional params correctly', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse(obsPayload));
      await createClient().series.getSeriesObservations({
        series_id: 'GDP',
        observation_start: '2020-01-01',
        observation_end: '2024-01-01',
        units: 'pc1',
        frequency: 'q',
      });
      const url = captureUrl();
      expect(url.searchParams.get('units')).toBe('pc1');
      expect(url.searchParams.get('frequency')).toBe('q');
    });

    it('getSeriesRelease — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ releases: [] }));
      await createClient().series.getSeriesRelease({ series_id: 'GDP' });
      expect(captureUrl().pathname).toBe('/fred/series/release');
    });

    it('searchSeries — calls correct endpoint with search_text', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ seriess: [], count: 0 }));
      await createClient().series.searchSeries({ search_text: 'unemployment rate' });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/series/search');
      expect(url.searchParams.get('search_text')).toBe('unemployment rate');
    });

    it('getSeriesSearchTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      await createClient().series.getSeriesSearchTags({ series_search_text: 'gdp' });
      expect(captureUrl().pathname).toBe('/fred/series/search/tags');
    });

    it('getSeriesSearchRelatedTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      await createClient().series.getSeriesSearchRelatedTags({ series_search_text: 'gdp', tag_names: 'nation' });
      expect(captureUrl().pathname).toBe('/fred/series/search/related_tags');
    });

    it('getSeriesTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      await createClient().series.getSeriesTags({ series_id: 'GDP' });
      expect(captureUrl().pathname).toBe('/fred/series/tags');
    });

    it('getSeriesUpdates — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ seriess: [] }));
      await createClient().series.getSeriesUpdates();
      expect(captureUrl().pathname).toBe('/fred/series/updates');
    });

    it('getSeriesVintageDates — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ vintage_dates: ['2024-01-01'] }));
      const result = await createClient().series.getSeriesVintageDates({ series_id: 'GDP' });
      expect(captureUrl().pathname).toBe('/fred/series/vintagedates');
      expect(result.vintage_dates[0]).toBe('2024-01-01');
    });
  });

  // ── Sources API ───────────────────────────────────────────────────────────

  describe('sources', () => {
    it('getSources — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ sources: [], count: 0 }));
      await createClient().sources.getSources();
      expect(captureUrl().pathname).toBe('/fred/sources');
    });

    it('getSource — calls correct endpoint with source_id', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ sources: [] }));
      await createClient().sources.getSource({ source_id: 1 });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/source');
      expect(url.searchParams.get('source_id')).toBe('1');
    });

    it('getSourceReleases — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ releases: [] }));
      await createClient().sources.getSourceReleases({ source_id: 1 });
      expect(captureUrl().pathname).toBe('/fred/source/releases');
    });
  });

  // ── Tags API ─────────────────────────────────────────────────────────────

  describe('tags', () => {
    it('getTags — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [], count: 0 }));
      await createClient().tags.getTags();
      expect(captureUrl().pathname).toBe('/fred/tags');
    });

    it('getTags — passes tag_group_id param', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      await createClient().tags.getTags({ tag_group_id: 'geo' });
      expect(captureUrl().searchParams.get('tag_group_id')).toBe('geo');
    });

    it('getRelatedTags — calls correct endpoint with tag_names', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ tags: [] }));
      await createClient().tags.getRelatedTags({ tag_names: 'nation;nsa' });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/related_tags');
      expect(url.searchParams.get('tag_names')).toBe('nation;nsa');
    });

    it('getTagsSeries — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ seriess: [] }));
      await createClient().tags.getTagsSeries({ tag_names: 'nation' });
      expect(captureUrl().pathname).toBe('/fred/tags/series');
    });
  });

  // ── Maps API ─────────────────────────────────────────────────────────────

  describe('maps', () => {
    it('getShapes — calls correct endpoint with shape type', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({}));
      await createClient().maps.getShapes({ shape: 'state' });
      const url = captureUrl();
      expect(url.pathname).toBe('/geofred/shapes/file');
      expect(url.searchParams.get('shape')).toBe('state');
    });

    it('getSeriesGroup — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ series_group: {} }));
      await createClient().maps.getSeriesGroup({ series_id: 'UNRATE' });
      expect(captureUrl().pathname).toBe('/geofred/series/group');
    });

    it('getSeriesData — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ meta: {} }));
      await createClient().maps.getSeriesData({ series_id: 'UNRATE' });
      expect(captureUrl().pathname).toBe('/geofred/series/data');
    });

    it('getRegionalData — calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({ meta: {} }));
      await createClient().maps.getRegionalData({
        series_group: '882',
        region_type: 'state',
        date: '2024-01-01',
        season: 'NSA',
        units: 'Percent',
      });
      expect(captureUrl().pathname).toBe('/geofred/regional/data');
    });
  });

  // ── V2 API ────────────────────────────────────────────────────────────────

  describe('v2', () => {
    it('getReleaseObservations — calls correct endpoint with release_id', async () => {
      mockFetch.mockResolvedValueOnce(makeMockResponse({}));
      await createClient().v2.getReleaseObservations({ release_id: 53 });
      const url = captureUrl();
      expect(url.pathname).toBe('/fred/v2/release/observations');
      expect(url.searchParams.get('release_id')).toBe('53');
    });
  });
});