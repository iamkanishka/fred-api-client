import type { HttpClient } from './utils/http';
import type {
  SeriesResponse,
  SeriesSearchResponse,
  ObservationsResponse,
  VintageDatesResponse,
  CategoryResponse,
  ReleaseResponse,
  TagsResponse,
  GetSeriesParams,
  GetSeriesCategoriesParams,
  GetSeriesObservationsParams,
  GetSeriesReleaseParams,
  GetSeriesSearchParams,
  GetSeriesSearchTagsParams,
  GetSeriesSearchRelatedTagsParams,
  GetSeriesTagsParams,
  GetSeriesUpdatesParams,
  GetSeriesVintageDatesParams,
} from './types';

export class SeriesAPI {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get an economic data series.
   * @see https://fred.stlouisfed.org/docs/api/fred/series.html
   * @example { series_id: 'GNPCA' }
   * @returns { realtime_start, realtime_end, seriess: [{ id, title, frequency, units, last_updated, popularity, ... }] }
   */
  getSeries(params: GetSeriesParams): Promise<SeriesResponse> {
    return this.http.get<SeriesResponse>('/fred/series', params);
  }

  /**
   * Get the categories for an economic data series.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_categories.html
   * @example { series_id: 'EXJPUS' }
   * @returns { categories: [{ id: 95, name: "Monthly Rates", parent_id: 15 }, ...] }
   */
  getSeriesCategories(params: GetSeriesCategoriesParams): Promise<CategoryResponse> {
    return this.http.get<CategoryResponse>('/fred/series/categories', params);
  }

  /**
   * Get the observations (data values) for an economic data series.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_observations.html
   * @example { series_id: 'GNPCA', observation_start: '2010-01-01', units: 'pc1', frequency: 'a' }
   * @returns { count, observations: [{ date, value, realtime_start, realtime_end }], ... }
   */
  getSeriesObservations(params: GetSeriesObservationsParams): Promise<ObservationsResponse> {
    return this.http.get<ObservationsResponse>('/fred/series/observations', params);
  }

  /**
   * Get the release for an economic data series.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_release.html
   * @example { series_id: 'IRA' }
   * @returns { releases: [{ id: 21, name: "H.6 Money Stock Measures", press_release: true, link: "..." }] }
   */
  getSeriesRelease(params: GetSeriesReleaseParams): Promise<ReleaseResponse> {
    return this.http.get<ReleaseResponse>('/fred/series/release', params);
  }

  /**
   * Get economic data series that match search keywords.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_search.html
   * @example { search_text: 'monetary service index', limit: 10, order_by: 'search_rank' }
   * @returns Paginated list of Series objects ordered by relevance
   */
  searchSeries(params: GetSeriesSearchParams): Promise<SeriesSearchResponse> {
    return this.http.get<SeriesSearchResponse>('/fred/series/search', params);
  }

  /**
   * Get the tags for a series search.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_search_tags.html
   * @example { series_search_text: 'monetary service index', tag_names: 'nation' }
   * @returns { tags: [{ name, group_id, created, popularity, series_count }, ...] }
   */
  getSeriesSearchTags(params: GetSeriesSearchTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/series/search/tags', params);
  }

  /**
   * Get the related tags for a series search.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_search_related_tags.html
   * @example { series_search_text: 'mortgage rate', tag_names: 'nation;usa' }
   * @returns { tags: [...] }
   */
  getSeriesSearchRelatedTags(params: GetSeriesSearchRelatedTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/series/search/related_tags', params);
  }

  /**
   * Get the tags for an economic data series.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_tags.html
   * @example { series_id: 'STLFSI', order_by: 'popularity', sort_order: 'desc' }
   * @returns { tags: [{ name, group_id, created, popularity, series_count }, ...] }
   */
  getSeriesTags(params: GetSeriesTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/series/tags', params);
  }

  /**
   * Get economic data series sorted by when observations were last updated.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_updates.html
   * @example { filter_value: 'macro', limit: 100 }
   * @returns Paginated list of recently-updated Series objects
   */
  getSeriesUpdates(params?: GetSeriesUpdatesParams): Promise<SeriesSearchResponse> {
    return this.http.get<SeriesSearchResponse>('/fred/series/updates', params);
  }

  /**
   * Get the dates when a series' data values were revised or new values released.
   * @see https://fred.stlouisfed.org/docs/api/fred/series_vintagedates.html
   * @example { series_id: 'GNPCA', sort_order: 'asc' }
   * @returns { vintage_dates: ["1958-12-21", "1959-02-19", ...] }
   */
  getSeriesVintageDates(params: GetSeriesVintageDatesParams): Promise<VintageDatesResponse> {
    return this.http.get<VintageDatesResponse>('/fred/series/vintagedates', params);
  }
}