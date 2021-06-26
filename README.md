# Filter Blocks (Artist Edition)

A portable version of [Filter Blocks](https://filter-blocks.netlify.app/) for artists developing a script for [Art Blocks](https://artblocks.io/)

## Getting started

To get started, create a folder in `/static` for your project. It should contain:

- `tokens.json` an array of your tokens
- `/image` a folder containing static thumbnails for your tokens
- `/generator` your project script

`/static` already contains an example folder based on [ArtBlocks 101 for Creators](https://github.com/ArtBlocks/docs)

### tokens.json

This JSON file should contain an array of the token you previously generated. Each token should have an `hash` and a `features` property. The `hash` will be your `tokenData.hash` and `features` and array of features, similarly to what Art Blocks expects. The token number will be the index of the token in the array.

```
{
  "hash": "0xde013c21142acab081e0c9c254ba75335e89eeb235fb7a9157a6ceed2ddffeab",
  "features": ["R:107", "G:34", "B:168", "Step:100", "Square"]
}
```

### Image folder

Add the static thumbnails for your tokens in this folder. You can specify the file type in the `config.json`.
The recommended image size is 600x600px.

### Generator

This folder should contain you script. It should accept a query parameter called `hash` for the embed in the UI. See `index.html` in the example for reference. If you use p5.js, you can just copy the example generator and replace the content of `script.js`.

*Pro tip*: you can later navigate `/[projectFolder]/generator` to get new generation without specificing the hash.

### config.json

Finally, edit `config.json` to reflect your project settings. *Without doing so, the project won't run.*

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

If you have any suggestion or feedback, feel free to ping me @stefan_contiero
Happy coding!
