import type { HttpClient } from './utils/http';
import type {
  ReleasesResponse,
  ReleaseResponse,
  ReleaseDatesResponse,
  ReleaseSeriesResponse,
  ReleaseSourcesResponse,
  ReleaseTablesResponse,
  TagsResponse,
  GetReleasesParams,
  GetAllReleaseDatesParams,
  GetReleaseParams,
  GetReleaseDatesParams,
  GetReleaseSeriesParams,
  GetReleaseSourcesParams,
  GetReleaseTagsParams,
  GetReleaseRelatedTagsParams,
  GetReleaseTablesParams,
} from './types';

export class ReleasesAPI {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get all releases of economic data.
   * @see https://fred.stlouisfed.org/docs/api/fred/releases.html
   * @example {}  or  { limit: 10, order_by: 'release_id', sort_order: 'asc' }
   * @returns { realtime_start, realtime_end, order_by, sort_order, count, offset, limit, releases: [...] }
   */
  getReleases(params?: GetReleasesParams): Promise<ReleasesResponse> {
    return this.http.get<ReleasesResponse>('/fred/releases', params);
  }

  /**
   * Get release dates for all releases of economic data.
   * @see https://fred.stlouisfed.org/docs/api/fred/releases_dates.html
   * @example { include_release_dates_with_no_data: true }
   * @returns { release_dates: [{ release_id, release_name, date }, ...] }
   */
  getAllReleaseDates(params?: GetAllReleaseDatesParams): Promise<ReleaseDatesResponse> {
    return this.http.get<ReleaseDatesResponse>('/fred/releases/dates', params);
  }

  /**
   * Get a release of economic data.
   * @see https://fred.stlouisfed.org/docs/api/fred/release.html
   * @example { release_id: 53 }
   * @returns { releases: [{ id: 53, name: "Gross Domestic Product", press_release: true, link: "..." }] }
   */
  getRelease(params: GetReleaseParams): Promise<ReleaseResponse> {
    return this.http.get<ReleaseResponse>('/fred/release', params);
  }

  /**
   * Get release dates for a specific release.
   * @see https://fred.stlouisfed.org/docs/api/fred/release_dates.html
   * @example { release_id: 82, include_release_dates_with_no_data: true }
   * @returns { release_dates: [{ release_id, date }, ...] }
   */
  getReleaseDates(params: GetReleaseDatesParams): Promise<ReleaseDatesResponse> {
    return this.http.get<ReleaseDatesResponse>('/fred/release/dates', params);
  }

  /**
   * Get the series on a release of economic data.
   * @see https://fred.stlouisfed.org/docs/api/fred/release_series.html
   * @example { release_id: 51, order_by: 'series_id', sort_order: 'asc' }
   * @returns Paginated list of Series objects
   */
  getReleaseSeries(params: GetReleaseSeriesParams): Promise<ReleaseSeriesResponse> {
    return this.http.get<ReleaseSeriesResponse>('/fred/release/series', params);
  }

  /**
   * Get the sources for a release of economic data.
   * @see https://fred.stlouisfed.org/docs/api/fred/release_sources.html
   * @example { release_id: 51 }
   * @returns { sources: [{ id, name, link, realtime_start, realtime_end }] }
   */
  getReleaseSources(params: GetReleaseSourcesParams): Promise<ReleaseSourcesResponse> {
    return this.http.get<ReleaseSourcesResponse>('/fred/release/sources', params);
  }

  /**
   * Get the tags for a release.
   * @see https://fred.stlouisfed.org/docs/api/fred/release_tags.html
   * @example { release_id: 86, tag_names: 'sa;foreign' }
   * @returns { tags: [{ name, group_id, created, popularity, series_count }, ...] }
   */
  getReleaseTags(params: GetReleaseTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/release/tags', params);
  }

  /**
   * Get the related tags for a release.
   * @see https://fred.stlouisfed.org/docs/api/fred/release_related_tags.html
   * @example { release_id: 86, tag_names: 'sa;foreign' }
   * @returns { tags: [...] }
   */
  getReleaseRelatedTags(params: GetReleaseRelatedTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/release/related_tags', params);
  }

  /**
   * Get the release table trees for a given release.
   * @see https://fred.stlouisfed.org/docs/api/fred/release_tables.html
   * @example { release_id: 53, element_id: 12886 }
   * @returns { name, element_id, release_id, elements: { "12887": { element_id, series_id, name, children: [...] }, ... } }
   */
  getReleaseTables(params: GetReleaseTablesParams): Promise<ReleaseTablesResponse> {
    return this.http.get<ReleaseTablesResponse>('/fred/release/tables', params);
  }
}