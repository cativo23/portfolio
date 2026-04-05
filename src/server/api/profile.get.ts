export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken;
  }

  const data = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/profile`, {
    method: 'GET',
    headers,
  });

  return data;
});
