import fs from 'fs';
import config from '../../../../config.json';

const data = JSON.parse(fs.readFileSync(`./static/${config.projectFolder}/tokens.json`, 'utf8'));
let tokens = [];

for (var i = 0; i < data.length; i += 1) {
  const token = data[i];
  tokens.push({
    tokenId: i,
    hash: token.hash,
    features: token.features.reduce((result, feature) => {
      const kv = feature.split(':');
      result[kv[0]] = (kv[1] || kv[0]).trim();

      return result;
    }, {})
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
