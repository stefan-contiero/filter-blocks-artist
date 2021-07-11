import fs from 'fs';
const config = JSON.parse(fs.readFileSync(`./config.json`, 'utf8'));

const storeData = (path, data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

(async function () {
  const generateToken = (p) => {
    let data = {};

    let hash = "0x";
    for (let i = 0; i < 64; i++) {
      hash += Math.floor(Math.random() * 16).toString(16);
    }
    data.hash = hash;
    data.tokenId = 999000000 + p;

    return data;
  };

  let tokens = [];
  let allFeatures = {};
  let { calculateFeatures } = await import(`./static/${config.projectFolder}/features.js`);

  for (let i = 0; i <= config.totalTokens; i++) {
    let tokenData = generateToken(i);
    let features = calculateFeatures(tokenData);

    features.forEach(f => {
      if (!allFeatures[f]) allFeatures[f] = 0;
      allFeatures[f] += 1;
    });

    tokens.push({
      ...tokenData,
      features,
    });
  }

  for (const [feature, total] of Object.entries(allFeatures)) {
    allFeatures[feature] = total / tokens.length;
  }

  for (let i = 0; i < tokens.length; i++) {
    let probability = 1;
    tokens[i].features.forEach(f => {
      probability *= allFeatures[f];
    });

    tokens[i].probability = probability;
  }

  tokens = tokens.sort((a, b) => a.probability - b.probability).map((t, i) => {
    t.rank = i + 1;
    return t;
  }).sort((a, b) => a.tokenId - b.tokenId);

  storeData(`./static/${config.projectFolder}/tokens-generated.json`, tokens);
}());
