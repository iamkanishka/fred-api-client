import type { HttpClient } from './utils/http';
import type {
  GeoSeriesGroupResponse,
  GeoSeriesDataResponse,
  GeoRegionalDataResponse,
  GetShapesParams,
  GetGeoSeriesGroupParams,
  GetGeoSeriesDataParams,
  GetGeoRegionalDataParams,
} from './types';

export class MapsAPI {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get geographic shape files (GeoJSON).
   * @see https://fred.stlouisfed.org/docs/api/geofred/shapes.html
   * @example { shape: 'state' }
   * @returns Raw GeoJSON FeatureCollection for the specified region type
   */
  getShapes(params: GetShapesParams): Promise<unknown> {
    return this.http.get<unknown>('/geofred/shapes/file', params);
  }

  /**
   * Get series group metadata — title, region type, frequency, date range.
   * @see https://fred.stlouisfed.org/docs/api/geofred/series_group.html
   * @example { series_id: 'SMU56000000500000001a' }
   * @returns { series_group: { title, region_type, series_group, season, units, frequency, min_date, max_date } }
   */
  getSeriesGroup(params: GetGeoSeriesGroupParams): Promise<GeoSeriesGroupResponse> {
    return this.http.get<GeoSeriesGroupResponse>('/geofred/series/group', params);
  }

  /**
   * Get series regional data for a specific date or date range.
   * @see https://fred.stlouisfed.org/docs/api/geofred/series_data.html
   * @example { series_id: 'WIPCPI', date: '2012-01-01' }
   * @returns { meta: { title, series_id, region_type, date, data: { "WI": { value, series_id }, ... } } }
   */
  getSeriesData(params: GetGeoSeriesDataParams): Promise<GeoSeriesDataResponse> {
    return this.http.get<GeoSeriesDataResponse>('/geofred/series/data', params);
  }

  /**
   * Get regional data for a series group.
   * @see https://fred.stlouisfed.org/docs/api/geofred/regional_data.html
   * @example { series_group: '882', region_type: 'state', date: '2013-01-01', season: 'NSA', units: 'Dollars' }
   * @returns { meta: { title, region, seasonality, units, frequency, date, data: { "01": [{ region, code, value, series_id }], ... } } }
   */
  getRegionalData(params: GetGeoRegionalDataParams): Promise<GeoRegionalDataResponse> {
    return this.http.get<GeoRegionalDataResponse>('/geofred/regional/data', params);
  }
}