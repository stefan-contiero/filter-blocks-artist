export const calculateFeatures = (tokenData) => {
  var seed = parseInt(tokenData.hash.slice(0, 16), 16);

  var DEFAULT_SIZE = 500
  var DIM = 1
  var M = DIM/DEFAULT_SIZE // Keep things relative
  var STEP = 100 * M
  var R = Math.floor(rnd_num(0,255))
  var G = Math.floor(rnd_num(0,255))
  var B = Math.floor(rnd_num(0,255))
  var STROKE_WEIGHT = rnd_num(1,50) * M

  function rnd_dec() {
    seed ^= seed << 13
    seed ^= seed >> 17
    seed ^= seed << 5
    return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000
  }
  function rnd_num(a, b) {
    return a + (b - a) * rnd_dec()
  }

  let features = ["R:"+R, "G:"+G, "B:"+B, "Step:100", "Square"]
  return features;
};

export default calculateFeatures;
