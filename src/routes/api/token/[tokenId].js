import fs from 'fs';
import config from '../../../../config.json';

const dataSource = config.mode === 'stats' ? 'tokens-generated' : 'tokens';
const data = JSON.parse(fs.readFileSync(`./static/${config.projectFolder}/${dataSource}.json`, 'utf8'));
let tokens = [];

for (var i = 0; i < data.length; i += 1) {
  const token = data[i];
  tokens.push({
    tokenId: i,
    hash: token.hash,
    probability: token.probability,
    rank: token.rank,
    features: token.features
  });
}

export function get({ params, fetch }) {
  const { tokenId } = params;
  try {
    const token = tokens[tokenId];

    return {
      status: 200,
      body: {
        ...config,
        token
      }
    };
  } catch (error) {
    return {
      status: 404,
      error
    };
  }
}
