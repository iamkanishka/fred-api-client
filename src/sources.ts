import type { HttpClient } from './utils/http';
import type {
  SourcesResponse,
  SourceResponse,
  SourceReleasesResponse,
  GetSourcesParams,
  GetSourceParams,
  GetSourceReleasesParams,
} from './types';

export class SourcesAPI {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get all sources of economic data.
   * @see https://fred.stlouisfed.org/docs/api/fred/sources.html
   * @example { limit: 10, order_by: 'source_id', sort_order: 'asc' }
   * @returns { count, sources: [{ id, name, link, realtime_start, realtime_end }, ...] }
   */
  getSources(params?: GetSourcesParams): Promise<SourcesResponse> {
    return this.http.get<SourcesResponse>('/fred/sources', params);
  }

  /**
   * Get a source of economic data.
   * @see https://fred.stlouisfed.org/docs/api/fred/source.html
   * @example { source_id: 1 }
   * @returns { sources: [{ id: 1, name: "Board of Governors of the Federal Reserve System", link: "http://..." }] }
   */
  getSource(params: GetSourceParams): Promise<SourceResponse> {
    return this.http.get<SourceResponse>('/fred/source', params);
  }

  /**
   * Get the releases for a source.
   * @see https://fred.stlouisfed.org/docs/api/fred/source_releases.html
   * @example { source_id: 1, limit: 10, order_by: 'name' }
   * @returns Paginated list of Release objects belonging to the source
   */
  getSourceReleases(params: GetSourceReleasesParams): Promise<SourceReleasesResponse> {
    return this.http.get<SourceReleasesResponse>('/fred/source/releases', params);
  }
}