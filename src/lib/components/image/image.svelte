<script type="text/javascript">
  import { onMount } from 'svelte';

  export let src;
  export let alt;

  const loaded = new Map();

  let visible = false;
  let thisImage;

  onMount(() => {
    thisImage.onload = () => {
      visible = true;
    };
  });

  const lazy = (node, src) => {
    const load = (src) => {
      if (loaded.has(src)) {
        node.setAttribute('src', src);
      } else {
        node.setAttribute(
          'src',
          'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        );

        const img = new Image();
        img.src = src;

        img.onload = () => {
          loaded.set(src, img);
          node.setAttribute('src', src);
        };
      }
    };

    load(src);

    return {
      update(src) {
        load(src);
      },
      destroy() {
        node.setAttribute('src', '');
      }
    };
  };
</script>

<img {alt} use:lazy={src} class:visible bind:this={thisImage} loading="lazy" />

<style lang="scss">
  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    opacity: 1;
    object-fit: cover;
    transition: 0.25s opacity ease-in-out;

    &:not(.visible) {
      opacity: 0;
      transition: 0;
    }
  }
</style>
