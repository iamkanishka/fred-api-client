# fred-api-client

[![CI](https://github.com/yourusername/fred-api-client/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/fred-api-client/actions)
[![npm version](https://badge.fury.io/js/fred-api-client.svg)](https://www.npmjs.com/package/fred-api-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully-typed TypeScript client for the [FRED® API](https://fred.stlouisfed.org/docs/api/fred/) (Federal Reserve Economic Data), published by the St. Louis Fed.

Covers **all 36 endpoints** across Categories, Releases, Series, Sources, Tags, GeoFRED Maps, and the v2 bulk API.

---

## Features

- ✅ Full TypeScript types for every request and response
- ✅ All 36 FRED® API endpoints covered
- ✅ ESM + CJS dual output
- ✅ Zero runtime dependencies
- ✅ Custom `fetch` support (bring your own, for Node 18-, Deno, Bun, etc.)
- ✅ Configurable timeout and base URL
- ✅ Meaningful error types (`FredError`) with HTTP status codes

---

## Installation

```bash
npm install fred-api-client
```

> **Node.js ≥ 18** is required (uses native `fetch`). For Node < 18 provide a custom `fetch` via the `fetch` option.

---

## Quick Start

```ts
import { FredClient } from 'fred-api-client';

const fred = new FredClient({ apiKey: 'YOUR_API_KEY' });

// Get GDP observations
const data = await fred.series.getSeriesObservations({ series_id: 'GDP' });
console.log(data.observations);

// Search for series
const results = await fred.series.searchSeries({ search_text: 'unemployment rate' });
console.log(results.seriess);
```

Get your free API key at: https://fred.stlouisfed.org/docs/api/api_key.html

---

## Configuration

```ts
const fred = new FredClient({
  apiKey: 'YOUR_API_KEY',      // required
  baseUrl: 'https://api.stlouisfed.org', // optional, default shown
  fileType: 'json',            // optional, 'json' | 'xml'
  timeout: 30_000,             // optional, milliseconds
  fetch: customFetchFn,        // optional, custom fetch implementation
});
```

---

## API Reference

All methods are async and return typed Promises. Parameters mirror the official FRED API docs exactly.

### `fred.categories`

| Method | FRED Endpoint |
|--------|--------------|
| `getCategory(params)` | `GET /fred/category` |
| `getCategoryChildren(params)` | `GET /fred/category/children` |
| `getCategoryRelated(params)` | `GET /fred/category/related` |
| `getCategorySeries(params)` | `GET /fred/category/series` |
| `getCategoryTags(params)` | `GET /fred/category/tags` |
| `getCategoryRelatedTags(params)` | `GET /fred/category/related_tags` |

### `fred.releases`

| Method | FRED Endpoint |
|--------|--------------|
| `getReleases(params?)` | `GET /fred/releases` |
| `getAllReleaseDates(params?)` | `GET /fred/releases/dates` |
| `getRelease(params)` | `GET /fred/release` |
| `getReleaseDates(params)` | `GET /fred/release/dates` |
| `getReleaseSeries(params)` | `GET /fred/release/series` |
| `getReleaseSources(params)` | `GET /fred/release/sources` |
| `getReleaseTags(params)` | `GET /fred/release/tags` |
| `getReleaseRelatedTags(params)` | `GET /fred/release/related_tags` |
| `getReleaseTables(params)` | `GET /fred/release/tables` |

### `fred.series`

| Method | FRED Endpoint |
|--------|--------------|
| `getSeries(params)` | `GET /fred/series` |
| `getSeriesCategories(params)` | `GET /fred/series/categories` |
| `getSeriesObservations(params)` | `GET /fred/series/observations` |
| `getSeriesRelease(params)` | `GET /fred/series/release` |
| `searchSeries(params)` | `GET /fred/series/search` |
| `getSeriesSearchTags(params)` | `GET /fred/series/search/tags` |
| `getSeriesSearchRelatedTags(params)` | `GET /fred/series/search/related_tags` |
| `getSeriesTags(params)` | `GET /fred/series/tags` |
| `getSeriesUpdates(params?)` | `GET /fred/series/updates` |
| `getSeriesVintageDates(params)` | `GET /fred/series/vintagedates` |

### `fred.sources`

| Method | FRED Endpoint |
|--------|--------------|
| `getSources(params?)` | `GET /fred/sources` |
| `getSource(params)` | `GET /fred/source` |
| `getSourceReleases(params)` | `GET /fred/source/releases` |

### `fred.tags`

| Method | FRED Endpoint |
|--------|--------------|
| `getTags(params?)` | `GET /fred/tags` |
| `getRelatedTags(params)` | `GET /fred/related_tags` |
| `getTagsSeries(params)` | `GET /fred/tags/series` |

### `fred.maps` (GeoFRED)

| Method | FRED Endpoint |
|--------|--------------|
| `getShapes(params)` | `GET /geofred/shapes/file` |
| `getSeriesGroup(params)` | `GET /geofred/series/group` |
| `getSeriesData(params)` | `GET /geofred/series/data` |
| `getRegionalData(params)` | `GET /geofred/regional/data` |

### `fred.v2` (Bulk API)

| Method | FRED Endpoint |
|--------|--------------|
| `getReleaseObservations(params)` | `GET /fred/v2/release/observations` |

---

## Error Handling

```ts
import { FredClient, FredError } from 'fred-api-client';

const fred = new FredClient({ apiKey: 'YOUR_API_KEY' });

try {
  const data = await fred.series.getSeries({ series_id: 'INVALID_ID' });
} catch (err) {
  if (err instanceof FredError) {
    console.error(`FRED Error [${err.code}]: ${err.message}`);
    // err.status  → HTTP status code
    // err.code    → FRED API error code
    // err.message → Human-readable message
  }
}
```

---

## Examples

### Fetch US GDP with percent change transformation

```ts
const gdp = await fred.series.getSeriesObservations({
  series_id: 'GDP',
  units: 'pc1',           // Percent change from year ago
  frequency: 'q',         // Quarterly
  observation_start: '2010-01-01',
});
```

### Search for series and get their tags

```ts
const search = await fred.series.searchSeries({
  search_text: 'consumer price index',
  limit: 5,
  order_by: 'popularity',
  sort_order: 'desc',
});

for (const s of search.seriess) {
  const tags = await fred.series.getSeriesTags({ series_id: (s as { id: string }).id });
  console.log(tags.tags.map((t) => t.name));
}
```

### Get state-level unemployment data (GeoFRED)

```ts
const regional = await fred.maps.getRegionalData({
  series_group: '882',
  region_type: 'state',
  date: '2024-01-01',
  season: 'NSA',
  units: 'Percent',
});
```

### Use with a custom fetch (Node < 18)

```ts
import fetch from 'node-fetch';
import { FredClient } from 'fred-api-client';

const fred = new FredClient({
  apiKey: 'YOUR_API_KEY',
  fetch: fetch as unknown as typeof globalThis.fetch,
});
```

---

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

---

## License

MIT © Your Name