import { browserApiBaseUrl } from '@/lib/api';
import { SimpleResponse } from '@models/base';

/** Sent by the backend's ExceptionHandlingMiddleware when values exceed column limits. */
export interface FieldLengthError {
  field: string;
  maxLength: number;
  actualLength: number;
}

/** One entry of ASP.NET's automatic model-validation 400 (ProblemDetails `errors`). */
export interface FieldValidationError {
  field: string;
  messages: string[];
}

export type SaveEntityResponse = SimpleResponse<any> & {
  errorCode?: string;
  fieldErrors?: FieldLengthError[];
  validationErrors?: FieldValidationError[];
};

type ProblemDetails = {
  title?: string;
  errors?: Record<string, string[] | string>;
};

function readValidationErrors(data: ProblemDetails | null | undefined) {
  if (!data?.errors || typeof data.errors !== 'object') return undefined;
  const entries = Object.entries(data.errors).map(([field, messages]) => ({
    field,
    messages: Array.isArray(messages) ? messages : [String(messages)],
  }));
  return entries.length ? entries : undefined;
}

/**
 * Persist an admin entity.
 *
 * File uploads must NOT go through Next.js Server Actions: the browser POSTs the
 * whole multipart body to the current page URL, which commonly ends as
 * ERR_CONNECTION_CLOSED under nginx / body-size limits.
 * Instead we POST/PUT via the cookie-aware BFF at /auth/bff/*.
 *
 * Cache busting is done by the caller via router.refresh() after navigation —
 * calling a Server Action here previously surfaced "Failed to fetch" into the
 * locale error boundary when the action hop failed.
 */
export async function saveEntity({
  endPoint,
  body,
  method,
}: {
  endPoint: string;
  body: FormData | Record<string, unknown>;
  method: 'POST' | 'PUT';
}): Promise<SaveEntityResponse> {
  try {
    const path = endPoint.replace(/^\/+/, '');
    const isFormData =
      typeof FormData !== 'undefined' && body instanceof FormData;

    const response = await fetch(`${browserApiBaseUrl}/${path}`, {
      method,
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData
        ? undefined
        : { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });

    let data: SaveEntityResponse & ProblemDetails;
    try {
      data = await response.json();
    } catch {
      return {
        data: null,
        isSuccess: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    if (!response.ok && data?.isSuccess !== true) {
      return {
        data: data?.data ?? null,
        isSuccess: false,
        error:
          data?.error ||
          data?.title ||
          `HTTP ${response.status}: ${response.statusText}`,
        errorCode: data?.errorCode,
        fieldErrors: data?.fieldErrors,
        validationErrors: readValidationErrors(data),
      };
    }

    return data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to save entity';
    return {
      data: null,
      isSuccess: false,
      error: message,
    };
  }
}
