<script>
  export let src;
  export let alt;
  export let ratio;

  import { onMount } from 'svelte';
  import IntersectionObserver from './intersection-observer.svelte';
  import Image from './image.svelte';

  let nativeLoading = false;

  onMount(() => {
    if ('loading' in HTMLImageElement.prototype) {
      nativeLoading = true;
    }
  });
</script>

<IntersectionObserver once={true} let:intersecting {ratio}>
  {#if intersecting || nativeLoading}
    <Image {src} {alt} />
  {/if}
</IntersectionObserver>
