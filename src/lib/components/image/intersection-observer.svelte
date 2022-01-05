<script>
  import { onMount } from 'svelte';
  export let ratio = 1;
  export let once = false;
  export let top = 0;
  export let bottom = 200;
  export let left = 0;
  export let right = 0;
  let intersecting = false;

  let container;
  onMount(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      const rootMargin = `${top}px ${right}px ${bottom}px ${left}px`;
      const observer = new IntersectionObserver(
        (entries) => {
          intersecting = entries[0].isIntersecting;
          if (intersecting && once) {
            observer.unobserve(container);
          }
        },
        {
          rootMargin
        }
      );
      observer.observe(container);
      return () => observer.unobserve(container);
    }
  });
</script>

<div class="img__container" style="padding-bottom: {(1 / ratio) * 100}%" bind:this={container}>
  <slot {intersecting} />
</div>

<style lang="scss">
  .img__container {
    position: relative;
    width: 100%;
    background-color: var(--color-image-background-start);
    background: repeating-linear-gradient(
      to top,
      var(--color-image-background-end),
      var(--color-image-background-start) 50%,
      var(--color-image-background-end)
    );
    background-size: 200% 200%;
    animation: loading 2s linear infinite;
    transform: translate3d(0, 0, 0);
  }

  @keyframes loading {
    0% {
      background-position: 0% 100%;
    }
    100% {
      background-position: 0% -100%;
    }
  }
</style>
