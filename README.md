# Filter Blocks (Artist Edition)

A portable version of [Filter Blocks](https://filter-blocks.netlify.app/) for artists developing a script for [Art Blocks](https://artblocks.io/)

## Modes

Filter Blocks for artists can run in two modes:

- `stats`: explore features and rarities for tokens without previews and the need to pre-export thumbnails. Before using this mode, specify `totalTokens` in `config.js` and run `npm run generate`
- `viewer`: explore features of previously minted tokens from a `token.json`

## Getting started

To get started, create a folder in `/static` for your project. It should contain:

- `tokens.json` an array of your tokens (optional if running in `stats` mode)
- `/image` a folder containing static thumbnails for your tokens (optional if running in `stats` mode)
- `/generator` your project script
- `features.js` your feature script

`/static` already contains an example folder based on [ArtBlocks 101 for Creators](https://github.com/ArtBlocks/docs)

### tokens.json

This JSON file should contain an array of the token you previously generated. Each token should have an `hash` and a `features` property. The `hash` will be your `tokenData.hash` and `features` and array of features, similarly to what Art Blocks expects. The token number will be the index of the token in the array.

```
{
  "hash": "0xde013c21142acab081e0c9c254ba75335e89eeb235fb7a9157a6ceed2ddffeab",
  "features": { "R": 107, "G": 34, "B": 168, "Step": 100, "Square": true }
}
```

**This is not needed when running in `stats` mode.**

### Image folder

Add the static thumbnails for your tokens in this folder. You can specify the file type in the `config.json`.
The recommended image size is 600x600px.

**This is not needed when running in `stats` mode.**

### Generator

This folder should contain you script. It should accept a query parameter called `hash` for the embed in the UI. See `index.html` in the example for reference. If you use p5.js, you can just copy the example generator and replace the content of `script.js`.

**Pro tip**: you can later navigate to `/[projectFolder]/generator/index.html` without specificing the hash to get new generations.

### feature.js

Export a function `calculateFeatures(tokenData)` that takes `tokenData` as input, and returns an object of features similar to what Art Blocks expects. **The script should not use `window` or DOM functions as it needs to run in node.js**

### config.json

Finally, edit `config.json` to reflect your project settings. **Without doing so, the project won't run.**

```
{
  "totalTokens": 111, // required for stats mode or to truncate token.json
  "mode": "stats", // stats or viewer
  "projectFolder": "example", // your project folder name
  "imageExtension": "png", // thumbnails extension, required for viewer
  "ratio": 1 // the ratio of your script, required for viewer
}
```

## Running

To run the project, execute in your terminal:

```
npm install
npm run build
npm run preview
```

It will be available at [http://localhost:3000](http://localhost:3000).

## Development

Filter Blocks is based on [SvelteKit](https://kit.svelte.dev/).
To run in development mode, just run `npm run dev`

---

If you have any suggestion or feedback, feel free to ping me [@stefan_contiero](https://twitter.com/stefan_contiero) / Discord

Happy coding!
