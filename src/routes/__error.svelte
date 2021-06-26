<script context="module">
  export function load({ error, status }) {
    return {
      props: { error, status }
    };
  }
</script>

<script>
  import { dev } from '$app/env';

  export let status;
  export let error;

  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;

  const title = offline ? 'Offline' : status;
  const message = offline ? 'You are not connected to the internet!' : error.message;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="error">
  <h1>{title}</h1>
  <p>{message}</p>

  {#if dev && error.stack}
    <pre>{error.stack}</pre>
  {/if}
</div>

<style lang="scss">
  .error {
    padding: var(--space-l) var(--space-m);
    min-height: 80vh;
  }

  h1 {
    font-size: 4em;
    line-height: 1;
  }
</style>
