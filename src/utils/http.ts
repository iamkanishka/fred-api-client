import { FredError } from '../types';
import type { FredAPIError, FredClientConfig } from '../types';

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fileType: string;
  private readonly timeout: number;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(config: FredClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://api.stlouisfed.org';
    this.fileType = config.fileType ?? 'json';
    this.timeout = config.timeout ?? 30_000;
    this.fetchImpl = config.fetch ?? globalThis.fetch;
  }

  async get<T>(path: string, params: unknown = {}): Promise<T> {
    const url = this.buildUrl(path, params);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await this.fetchImpl(url.toString(), {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null) as FredAPIError | null;
        throw new FredError(
          errorBody?.error_message ?? `HTTP ${response.status}: ${response.statusText}`,
          errorBody?.error_code ?? response.status,
          response.status,
        );
      }

      return response.json() as Promise<T>;
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof FredError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new FredError(`Request timed out after ${this.timeout}ms`, 408, 408);
      }
      throw new FredError(
        err instanceof Error ? err.message : 'Unknown error',
        0,
      );
    }
  }

  /** Build URL including api_key and file_type */
  private buildUrl(path: string, params: unknown): URL {
    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('file_type', this.fileType);

    if (params && typeof params === 'object') {
      for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url;
  }
}