import type { HttpClient } from './utils/http';
import type {
  CategoryResponse,
  CategorySeriesResponse,
  TagsResponse,
  GetCategoryParams,
  GetCategoryChildrenParams,
  GetCategoryRelatedParams,
  GetCategorySeriesParams,
  GetCategoryTagsParams,
  GetCategoryRelatedTagsParams,
} from './types';

export class CategoriesAPI {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get a category.
   * @see https://fred.stlouisfed.org/docs/api/fred/category.html
   * @example { category_id: 125 }
   * @returns { categories: [{ id: 125, name: "Trade Balance", parent_id: 13 }] }
   */
  getCategory(params: GetCategoryParams): Promise<CategoryResponse> {
    return this.http.get<CategoryResponse>('/fred/category', params);
  }

  /**
   * Get the child categories for a specified parent category.
   * @see https://fred.stlouisfed.org/docs/api/fred/category_children.html
   * @example { category_id: 13 }
   * @returns { categories: [{ id: 16, name: "Exports", parent_id: 13 }, ...] }
   */
  getCategoryChildren(params: GetCategoryChildrenParams): Promise<CategoryResponse> {
    return this.http.get<CategoryResponse>('/fred/category/children', params);
  }

  /**
   * Get the related categories for a category.
   * @see https://fred.stlouisfed.org/docs/api/fred/category_related.html
   * @example { category_id: 32073 }
   * @returns { categories: [...] }
   */
  getCategoryRelated(params: GetCategoryRelatedParams): Promise<CategoryResponse> {
    return this.http.get<CategoryResponse>('/fred/category/related', params);
  }

  /**
   * Get the series in a category.
   * @see https://fred.stlouisfed.org/docs/api/fred/category_series.html
   * @example { category_id: 125, limit: 10, order_by: 'popularity', sort_order: 'desc' }
   * @returns Paginated list of Series objects
   */
  getCategorySeries(params: GetCategorySeriesParams): Promise<CategorySeriesResponse> {
    return this.http.get<CategorySeriesResponse>('/fred/category/series', params);
  }

  /**
   * Get the tags for a category.
   * @see https://fred.stlouisfed.org/docs/api/fred/category_tags.html
   * @example { category_id: 125, tag_names: 'trade;goods' }
   * @returns { realtime_start, realtime_end, order_by, sort_order, count, offset, limit, tags: [...] }
   */
  getCategoryTags(params: GetCategoryTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/category/tags', params);
  }

  /**
   * Get the related tags for a category.
   * @see https://fred.stlouisfed.org/docs/api/fred/category_related_tags.html
   * @example { category_id: 125, tag_names: 'services;quarterly' }
   * @returns { tags: [{ name, group_id, created, popularity, series_count }, ...] }
   */
  getCategoryRelatedTags(params: GetCategoryRelatedTagsParams): Promise<TagsResponse> {
    return this.http.get<TagsResponse>('/fred/category/related_tags', params);
  }
}