export const initialize = async () => {
  if (import.meta.env.DEV) {
    return (await import("../external/worker")).worker.start({
      onUnhandledRequest: "bypass",
    });
  }
  return Promise.resolve();
};
