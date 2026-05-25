import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });
export const getCached = async (key, fn) => {
    const cached = cache.get(key);
    if (cached !== undefined) {
        return cached;
    }
    const data = await fn();
    cache.set(key, data);
    return data;
};
