import NodeCache from "node-cache"

export const cache = new NodeCache({ checkperiod: 0, stdTTL: 0 })
