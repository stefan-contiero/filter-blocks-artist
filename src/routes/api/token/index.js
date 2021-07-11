import fs from 'fs';
import config from '../../../../config.json';

const dataSource = config.mode === 'stats' ? 'tokens-generated' : 'tokens';
const data = JSON.parse(fs.readFileSync(`./static/${config.projectFolder}/${dataSource}.json`, 'utf8'));
const totalTokens = Math.min(config.totalTokens || data.length, data.length);
let tokens = [];

for (var i = 0; i < totalTokens; i += 1) {
  const token = data[i];
  tokens.push({
    tokenId: i,
    hash: token.hash,
    probability: token.probability,
    rank: token.rank,
    features: token.features.reduce((result, feature) => {
      const kv = feature.split(':');
      result[kv[0]] = (kv[1] || kv[0]).trim();

      return result;
    }, {})
  });
}

export function get() {
  return {
    status: 200,
    body: {
      ...config,
      tokens
    }
  };
}
