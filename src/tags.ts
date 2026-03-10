import type { HttpClient } from './utils/http';
import type {
  TagsResponse,
  TagsSeriesResponse,
  GetTagsParams,
  GetRelatedTagsParams,
  GetTagsSeriesParams,
} from './types';

export class TagsAPI {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get all tags, search for tags, or get tags by name.
   * @see https://fred.stlouisfed.org/docs/api/fred/tags.html
   * @example { tag_group_id: 'geo', search_text: 'united states', limit: 10 }
   * @returns { count, tags: [{ name, group_id, created, popularity, series_count }, ...] }
   */
  getTags(params?: GetTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/tags', params);
  }

  /**
   * Get the related tags for one or more tags.
   * @see https://fred.stlouisfed.org/docs/api/fred/related_tags.html
   * @example { tag_names: 'nation;nsa', limit: 10 }
   * @returns { tags: [{ name, group_id, created, popularity, series_count }, ...] }
   */
  getRelatedTags(params: GetRelatedTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/related_tags', params);
  }

  /**
   * Get the series matching tags.
   * @see https://fred.stlouisfed.org/docs/api/fred/tags_series.html
   * @example { tag_names: 'nation;nsa', order_by: 'popularity', sort_order: 'desc' }
   * @returns Paginated list of Series objects that match all specified tags
   */
  getTagsSeries(params: GetTagsSeriesParams): Promise<TagsSeriesResponse> {
    return this.http.get<TagsSeriesResponse>('/fred/tags/series', params);
  }
}