import { AsyncLocalStorage } from 'async_hooks';

interface RequestStore {
  traceId: string;
}

export const requestContext = new AsyncLocalStorage<RequestStore>();

export const getTraceId = (): string | undefined => {
  return requestContext.getStore()?.traceId;
};
