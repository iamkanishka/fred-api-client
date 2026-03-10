import type { HttpClient } from '../utils/http';
import type { GetV2ReleaseObservationsParams } from '../types';

export class V2API {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get observations for ALL series on a release in bulk, including full revision history.
   * Prefer this over repeated fred/series/observations calls when you need an entire release.
   * @see https://fred.stlouisfed.org/docs/api/fred/v2/index.html
   * @example { release_id: 53, file_type: 'json' }
   * @returns Bulk observation data for all series in the release
   */
  getReleaseObservations(params: GetV2ReleaseObservationsParams): Promise<unknown> {
    return this.http.get<unknown>('/fred/v2/release/observations', params);
  }
}