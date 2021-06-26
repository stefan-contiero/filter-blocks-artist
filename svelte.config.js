/** @type {import('@sveltejs/kit').Config} */
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [autoprefixer()]
  },
  scss: {
    prependData: `@import 'src/stylesheets/imports/variables.scss';`
  }
});

const config = {
  kit: {
    ssr: false,
    target: '#svelte'
  },
  preprocess
};

export default config;
