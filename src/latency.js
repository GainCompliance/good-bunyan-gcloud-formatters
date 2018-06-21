export function calculateLatencyFrom(responseTime) {
  const nanoSeconds = responseTime * 1e6;

  return {
    seconds: Math.floor(nanoSeconds / 1e9),
    nanos: Math.floor(nanoSeconds % 1e9)
  };
}
