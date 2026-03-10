// =============================================================================
// fred-api-client — Complete Type Definitions
// Verified against https://fred.stlouisfed.org/docs/api/fred/
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

/** ISO 8601 date string e.g. "2024-01-15" */
export type DateString = string;

/** ISO 8601 datetime string e.g. "2013-07-31 09:26:16-05" */
export type DateTimeString = string;

export type FileType = 'json' | 'xml';
export type SortOrder = 'asc' | 'desc';

export type Frequency =
  | 'd'
  | 'w'
  | 'bw'
  | 'm'
  | 'q'
  | 'sa'
  | 'a'
  | 'wef'
  | 'weth'
  | 'wew'
  | 'wetu'
  | 'wem'
  | 'wesu'
  | 'wesa'
  | 'bwew'
  | 'bwem';

export type AggregationMethod = 'avg' | 'sum' | 'eop';

export type Units = 'lin' | 'chg' | 'ch1' | 'pch' | 'pc1' | 'pca' | 'cch' | 'cca' | 'log';

export type OutputType = 1 | 2 | 3 | 4;

export type TagGroupId = 'freq' | 'gen' | 'geo' | 'geot' | 'rls' | 'seas' | 'src';

export type ShapeType =
  | 'bea'
  | 'msa'
  | 'frb'
  | 'necta'
  | 'state'
  | 'country'
  | 'county'
  | 'censusregion'
  | 'censusdivision';

export type Seasonality = 'SA' | 'NSA' | 'SSA' | 'SAAR' | 'NSAAR';

// =============================================================================
// SHARED ENTITIES
// =============================================================================

export interface Category {
  id: number;
  name: string;
  parent_id: number;
  notes?: string;
}

export interface Release {
  id: number;
  realtime_start: DateString;
  realtime_end: DateString;
  name: string;
  press_release: boolean;
  link?: string;
  notes?: string;
}

export interface ReleaseDate {
  release_id: number;
  release_name?: string;
  date: DateString;
}

export interface Series {
  id: string;
  realtime_start: DateString;
  realtime_end: DateString;
  title: string;
  observation_start: DateString;
  observation_end: DateString;
  frequency: string;
  frequency_short: string;
  units: string;
  units_short: string;
  seasonal_adjustment: string;
  seasonal_adjustment_short: string;
  last_updated: DateTimeString;
  popularity: number;
  group_popularity?: number;
  notes?: string;
}

export interface Observation {
  realtime_start: DateString;
  realtime_end: DateString;
  date: DateString;
  /** String-encoded numeric value, or "." for missing data */
  value: string;
}

export interface Source {
  id: number;
  realtime_start: DateString;
  realtime_end: DateString;
  name: string;
  link?: string;
  notes?: string;
}

export interface Tag {
  name: string;
  group_id: TagGroupId;
  notes?: string;
  created: DateTimeString;
  popularity: number;
  series_count: number;
}

export interface ReleaseTableElement {
  element_id: number;
  release_id: number;
  series_id: string;
  parent_id: number;
  line: string;
  type: string;
  name: string;
  level: string;
  children: ReleaseTableElement[];
}

// =============================================================================
// SHARED PAGINATION ENVELOPE
// =============================================================================

export interface PaginatedResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  order_by: string;
  sort_order: SortOrder;
  count: number;
  offset: number;
  limit: number;
}

// =============================================================================
// CATEGORY RESPONSES
// =============================================================================

/** fred/category  •  fred/category/children  •  fred/category/related  •  fred/series/categories */
export interface CategoryResponse {
  categories: Category[];
}

/** fred/category/series */
export interface CategorySeriesResponse extends PaginatedResponse {
  seriess: Series[];
}

// =============================================================================
// RELEASE RESPONSES
// =============================================================================

/** fred/releases */
export interface ReleasesResponse extends PaginatedResponse {
  releases: Release[];
}

/** fred/release  •  fred/series/release */
export interface ReleaseResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  releases: Release[];
}

/** fred/releases/dates  •  fred/release/dates */
export interface ReleaseDatesResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  order_by: string;
  sort_order: SortOrder;
  count: number;
  offset: number;
  limit: number;
  release_dates: ReleaseDate[];
}

/** fred/release/series */
export interface ReleaseSeriesResponse extends PaginatedResponse {
  seriess: Series[];
}

/** fred/release/sources */
export interface ReleaseSourcesResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  sources: Source[];
}

/** fred/release/tables */
export interface ReleaseTablesResponse {
  name: string;
  element_id: number;
  release_id: number;
  elements: Record<string, ReleaseTableElement>;
}

// =============================================================================
// SERIES RESPONSES
// =============================================================================

/** fred/series */
export interface SeriesResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  seriess: Series[];
}

/** fred/series/observations */
export interface ObservationsResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  observation_start: DateString;
  observation_end: DateString;
  units: string;
  output_type: OutputType;
  file_type: string;
  order_by: string;
  sort_order: SortOrder;
  count: number;
  offset: number;
  limit: number;
  observations: Observation[];
}

/** fred/series/search  •  fred/series/updates  •  fred/tags/series */
export interface SeriesSearchResponse extends PaginatedResponse {
  seriess: Series[];
}

/** fred/series/vintagedates */
export interface VintageDatesResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  vintage_dates: DateString[];
}

// =============================================================================
// SOURCE RESPONSES
// =============================================================================

/** fred/sources */
export interface SourcesResponse extends PaginatedResponse {
  sources: Source[];
}

/** fred/source */
export interface SourceResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  sources: Source[];
}

/** fred/source/releases */
export interface SourceReleasesResponse extends PaginatedResponse {
  releases: Release[];
}

// =============================================================================
// TAG RESPONSES
// =============================================================================

/** fred/tags  •  fred/related_tags  •  fred/category/tags  •  fred/category/related_tags
 *  fred/release/tags  •  fred/release/related_tags  •  fred/series/tags
 *  fred/series/search/tags  •  fred/series/search/related_tags */
export interface TagsResponse {
  realtime_start: DateString;
  realtime_end: DateString;
  order_by: string;
  sort_order: SortOrder;
  count: number;
  offset: number;
  limit: number;
  tags: Tag[];
}

/** fred/tags/series */
export interface TagsSeriesResponse extends PaginatedResponse {
  seriess: Series[];
}

// =============================================================================
// GEOFRED RESPONSES
// =============================================================================

export interface GeoSeriesGroup {
  title: string;
  region_type: ShapeType;
  series_group: string;
  season: Seasonality;
  units: string;
  frequency: Frequency;
  min_date: DateString;
  max_date: DateString;
}

/** geofred/series/group */
export interface GeoSeriesGroupResponse {
  series_group: GeoSeriesGroup;
}

export interface GeoDataPoint {
  value: string;
  series_id: string;
}

export interface GeoSeriesDataMeta {
  title: string;
  region: string;
  series_id: string;
  region_type: ShapeType;
  series_group: string;
  season: Seasonality;
  units: string;
  frequency: Frequency;
  date: DateString;
  data: Record<string, GeoDataPoint>;
}

/** geofred/series/data */
export interface GeoSeriesDataResponse {
  meta: GeoSeriesDataMeta;
}

export interface GeoRegionalDataPoint {
  region: string;
  code: string;
  value: string;
  series_id: string;
}

/** geofred/regional/data */
export interface GeoRegionalDataResponse {
  meta: {
    title: string;
    region: string;
    seasonality: Seasonality;
    units: string;
    frequency: Frequency;
    date: DateString;
    data: Record<string, GeoRegionalDataPoint[]>;
  };
}

// =============================================================================
// CATEGORY REQUEST PARAMS
// =============================================================================

/** GET /fred/category */
export interface GetCategoryParams {
  category_id: number;
}

/** GET /fred/category/children */
export interface GetCategoryChildrenParams {
  category_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/category/related */
export interface GetCategoryRelatedParams {
  category_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/category/series */
export interface GetCategorySeriesParams {
  category_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–1000, default 1000 */
  limit?: number;
  offset?: number;
  order_by?:
    | 'series_id'
    | 'title'
    | 'units'
    | 'frequency'
    | 'seasonal_adjustment'
    | 'realtime_start'
    | 'realtime_end'
    | 'last_updated'
    | 'observation_start'
    | 'observation_end'
    | 'popularity'
    | 'group_popularity';
  sort_order?: SortOrder;
  filter_variable?: 'frequency' | 'units' | 'seasonal_adjustment';
  filter_value?: string;
  /** Semicolon-delimited tag names e.g. "trade;goods" */
  tag_names?: string;
  /** Requires tag_names to also be set */
  exclude_tag_names?: string;
}

/** GET /fred/category/tags */
export interface GetCategoryTagsParams {
  category_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
  tag_names?: string;
  tag_group_id?: TagGroupId;
  search_text?: string;
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/category/related_tags */
export interface GetCategoryRelatedTagsParams {
  category_id: number;
  /** Required. Semicolon-delimited e.g. "services;quarterly" */
  tag_names: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  exclude_tag_names?: string;
  tag_group_id?: TagGroupId;
  search_text?: string;
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

// =============================================================================
// RELEASE REQUEST PARAMS
// =============================================================================

/** GET /fred/releases */
export interface GetReleasesParams {
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–1000, default 1000 */
  limit?: number;
  offset?: number;
  order_by?: 'release_id' | 'name' | 'press_release' | 'realtime_start' | 'realtime_end';
  sort_order?: SortOrder;
}

/** GET /fred/releases/dates */
export interface GetAllReleaseDatesParams {
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–1000, default 1000 */
  limit?: number;
  offset?: number;
  order_by?: 'release_date' | 'release_id' | 'release_name';
  sort_order?: SortOrder;
  include_release_dates_with_no_data?: boolean;
}

/** GET /fred/release */
export interface GetReleaseParams {
  release_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/release/dates */
export interface GetReleaseDatesParams {
  release_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–10000, default 10000 */
  limit?: number;
  offset?: number;
  sort_order?: SortOrder;
  include_release_dates_with_no_data?: boolean;
}

/** GET /fred/release/series */
export interface GetReleaseSeriesParams {
  release_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
  limit?: number;
  offset?: number;
  order_by?:
    | 'series_id'
    | 'title'
    | 'units'
    | 'frequency'
    | 'seasonal_adjustment'
    | 'realtime_start'
    | 'realtime_end'
    | 'last_updated'
    | 'observation_start'
    | 'observation_end'
    | 'popularity'
    | 'group_popularity';
  sort_order?: SortOrder;
  filter_variable?: 'frequency' | 'units' | 'seasonal_adjustment';
  filter_value?: string;
  tag_names?: string;
  exclude_tag_names?: string;
}

/** GET /fred/release/sources */
export interface GetReleaseSourcesParams {
  release_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/release/tags */
export interface GetReleaseTagsParams {
  release_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
  tag_names?: string;
  tag_group_id?: TagGroupId;
  search_text?: string;
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/release/related_tags */
export interface GetReleaseRelatedTagsParams {
  release_id: number;
  /** Required. */
  tag_names: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  exclude_tag_names?: string;
  tag_group_id?: TagGroupId;
  search_text?: string;
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/release/tables */
export interface GetReleaseTablesParams {
  release_id: number;
  element_id?: number;
  include_observation_values?: boolean;
  observation_date?: DateString;
}

// =============================================================================
// SERIES REQUEST PARAMS
// =============================================================================

/** GET /fred/series */
export interface GetSeriesParams {
  series_id: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/series/categories */
export interface GetSeriesCategoriesParams {
  series_id: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/series/observations */
export interface GetSeriesObservationsParams {
  series_id: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–100000, default 100000 */
  limit?: number;
  offset?: number;
  sort_order?: SortOrder;
  observation_start?: DateString;
  observation_end?: DateString;
  /** Default: "lin" */
  units?: Units;
  frequency?: Frequency;
  /** Default: "avg" */
  aggregation_method?: AggregationMethod;
  /** Default: 1 */
  output_type?: OutputType;
  vintage_dates?: string;
}

/** GET /fred/series/release */
export interface GetSeriesReleaseParams {
  series_id: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/series/search */
export interface GetSeriesSearchParams {
  search_text: string;
  /** Default: "full_text" */
  search_type?: 'full_text' | 'series_id';
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–1000, default 1000 */
  limit?: number;
  offset?: number;
  order_by?:
    | 'search_rank'
    | 'series_id'
    | 'title'
    | 'units'
    | 'frequency'
    | 'seasonal_adjustment'
    | 'realtime_start'
    | 'realtime_end'
    | 'last_updated'
    | 'observation_start'
    | 'observation_end'
    | 'popularity'
    | 'group_popularity';
  sort_order?: SortOrder;
  filter_variable?: 'frequency' | 'units' | 'seasonal_adjustment';
  filter_value?: string;
  tag_names?: string;
  exclude_tag_names?: string;
}

/** GET /fred/series/search/tags */
export interface GetSeriesSearchTagsParams {
  series_search_text: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  tag_names?: string;
  tag_group_id?: TagGroupId;
  tag_search_text?: string;
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/series/search/related_tags */
export interface GetSeriesSearchRelatedTagsParams {
  series_search_text: string;
  /** Required. */
  tag_names: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  exclude_tag_names?: string;
  tag_group_id?: TagGroupId;
  tag_search_text?: string;
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/series/tags */
export interface GetSeriesTagsParams {
  series_id: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/series/updates */
export interface GetSeriesUpdatesParams {
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–100, default 100 */
  limit?: number;
  offset?: number;
  /** Default: "all" */
  filter_value?: 'macro' | 'regional' | 'all';
  /** yyyyMMddHHmm format */
  start_time?: string;
  end_time?: string;
}

/** GET /fred/series/vintagedates */
export interface GetSeriesVintageDatesParams {
  series_id: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  sort_order?: SortOrder;
}

// =============================================================================
// SOURCE REQUEST PARAMS
// =============================================================================

/** GET /fred/sources */
export interface GetSourcesParams {
  realtime_start?: DateString;
  realtime_end?: DateString;
  /** 1–1000, default 1000 */
  limit?: number;
  offset?: number;
  order_by?: 'source_id' | 'name' | 'realtime_start' | 'realtime_end';
  sort_order?: SortOrder;
}

/** GET /fred/source */
export interface GetSourceParams {
  source_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
}

/** GET /fred/source/releases */
export interface GetSourceReleasesParams {
  source_id: number;
  realtime_start?: DateString;
  realtime_end?: DateString;
  limit?: number;
  offset?: number;
  order_by?: 'release_id' | 'name' | 'press_release' | 'realtime_start' | 'realtime_end';
  sort_order?: SortOrder;
}

// =============================================================================
// TAG REQUEST PARAMS
// =============================================================================

/** GET /fred/tags */
export interface GetTagsParams {
  realtime_start?: DateString;
  realtime_end?: DateString;
  tag_names?: string;
  tag_group_id?: TagGroupId;
  search_text?: string;
  /** 1–1000, default 1000 */
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/related_tags */
export interface GetRelatedTagsParams {
  /** Required. Semicolon-delimited e.g. "nation;nsa" */
  tag_names: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  exclude_tag_names?: string;
  tag_group_id?: TagGroupId;
  search_text?: string;
  limit?: number;
  offset?: number;
  order_by?: 'series_count' | 'popularity' | 'created' | 'name' | 'group_id';
  sort_order?: SortOrder;
}

/** GET /fred/tags/series */
export interface GetTagsSeriesParams {
  /** Required. Series must match ALL of these tags. Semicolon-delimited. */
  tag_names: string;
  exclude_tag_names?: string;
  realtime_start?: DateString;
  realtime_end?: DateString;
  limit?: number;
  offset?: number;
  order_by?:
    | 'series_id'
    | 'title'
    | 'units'
    | 'frequency'
    | 'seasonal_adjustment'
    | 'realtime_start'
    | 'realtime_end'
    | 'last_updated'
    | 'observation_start'
    | 'observation_end'
    | 'popularity'
    | 'group_popularity';
  sort_order?: SortOrder;
}

// =============================================================================
// GEOFRED REQUEST PARAMS
// =============================================================================

/** GET /geofred/shapes/file */
export interface GetShapesParams {
  shape: ShapeType;
}

/** GET /geofred/series/group */
export interface GetGeoSeriesGroupParams {
  /** e.g. "SMU56000000500000001a" */
  series_id: string;
}

/** GET /geofred/series/data */
export interface GetGeoSeriesDataParams {
  series_id: string;
  date?: DateString;
  start_date?: DateString;
}

/** GET /geofred/regional/data */
export interface GetGeoRegionalDataParams {
  /** e.g. "882" */
  series_group: string;
  region_type: ShapeType;
  date: DateString;
  season: Seasonality;
  /** e.g. "Dollars" */
  units: string;
  frequency?: Frequency;
  /** Default: "lin" */
  transformation?: Units;
}

// =============================================================================
// V2 REQUEST PARAMS
// =============================================================================

/** GET /fred/v2/release/observations */
export interface GetV2ReleaseObservationsParams {
  release_id: number;
  element_id?: number;
  observation_date?: DateString;
  file_type?: 'json' | 'xml' | 'txt' | 'xls';
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface FredAPIError {
  error_code: number;
  error_message: string;
}

export class FredError extends Error {
  public readonly code: number;
  public readonly status: number | undefined;

  constructor(message: string, code: number, status?: number) {
    super(message);
    this.name = 'FredError';
    this.code = code;
    this.status = status;
  }
}

// =============================================================================
// CLIENT CONFIG
// =============================================================================

export interface FredClientConfig {
  /** Your FRED API key. Get one at https://fred.stlouisfed.org/docs/api/api_key.html */
  apiKey: string;
  /** Override the base URL. Default: "https://api.stlouisfed.org" */
  baseUrl?: string;
  /** Response file format. Default: "json" */
  fileType?: FileType;
  /** Request timeout in ms. Default: 30000 */
  timeout?: number;
  /** Custom fetch implementation (for Node < 18, Deno, Bun, tests) */
  fetch?: typeof fetch;
}
