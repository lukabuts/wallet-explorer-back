import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

export const getCached = async (key: string, fn: () => Promise<any>) => {
  let data = cache.get(key);
  if (data !== undefined) {
    return data;
  }

  data = await fn();
  cache.set(key, data);
  return data;
};
