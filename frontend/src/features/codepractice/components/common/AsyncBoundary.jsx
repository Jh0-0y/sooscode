export default function AsyncBoundary({
  isLoading,
  isError,
  error,
  loadingFallback = null,
  errorFallback = null,
  children,
}) {
  if (isLoading) return loadingFallback;
  if (isError) return errorFallback ?? <div>{error?.message}</div>;
  return children;
}
