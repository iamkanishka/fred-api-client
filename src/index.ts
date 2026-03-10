import { HttpClient } from './utils/http.js';
import { CategoriesAPI } from './categories';
import { ReleasesAPI } from './releases';
import { SeriesAPI } from './series';
import { SourcesAPI } from './sources';
import { TagsAPI } from './tags';
import { MapsAPI } from './maps';
import { V2API } from './v2';
import type { FredClientConfig } from './types';

export { FredError } from './types';
export type * from './types';

/**
 * FredClient — A fully-typed TypeScript client for the FRED® API.
 *
 * @example
 * ```ts
 * import { FredClient } from 'fred-api-client';
 *
 * const fred = new FredClient({ apiKey: 'YOUR_API_KEY' });
 *
 * // Get GDP observations
 * const data = await fred.series.getSeriesObservations({ series_id: 'GDP' });
 *
 * // Search for series
 * const results = await fred.series.searchSeries({ search_text: 'unemployment rate' });
 *
 * // Get geographic data
 * const geo = await fred.maps.getSeriesData({ series_id: 'UNRATE' });
 * ```
 */
export class FredClient {
  /** Categories endpoints */
  public readonly categories: CategoriesAPI;
  /** Releases endpoints */
  public readonly releases: ReleasesAPI;
  /** Series endpoints */
  public readonly series: SeriesAPI;
  /** Sources endpoints */
  public readonly sources: SourcesAPI;
  /** Tags endpoints */
  public readonly tags: TagsAPI;
  /** GeoFRED / Maps endpoints */
  public readonly maps: MapsAPI;
  /** API v2 (bulk) endpoints */
  public readonly v2: V2API;

  constructor(config: FredClientConfig) {
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error('FredClient requires a non-empty apiKey.');
    }

    const http = new HttpClient(config);

    this.categories = new CategoriesAPI(http);
    this.releases = new ReleasesAPI(http);
    this.series = new SeriesAPI(http);
    this.sources = new SourcesAPI(http);
    this.tags = new TagsAPI(http);
    this.maps = new MapsAPI(http);
    this.v2 = new V2API(http);
  }
}