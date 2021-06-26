<script context="module">
  export async function load({ page, fetch }) {
    try {
      const { tokenId } = page.params;

      const getToken = await fetch(`/api/token/${tokenId}`);
      const result = await getToken.json();

      return {
        props: {
          ...result
        }
      };
    } catch (error) {
      return {
        status: 404,
        error
      };
    }
  }
</script>

<script>
  import Loader from '$lib/components/loader.svelte';

  export let token;
  export let projectFolder;

  const getURL = (feature, name) => new URLSearchParams({ [feature]: name }).toString();
  const goBack = () => history.back();
</script>

<svelte:head>
  <title>Token #{token.tokenId}</title>
</svelte:head>

<template src="./_template.pug" />

<style lang="scss">
  .token-detail {
    display: grid;
    grid-template-columns: 320px 5fr;

    .back {
      cursor: pointer;
    }

    ul {
      position: relative;
      padding: var(--space);
      margin: 0;
      font-size: 0.8em;
      list-style: none;
      background-color: var(--color-surface);

      a {
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &__info {
      margin-bottom: var(--space);

      h2 {
        margin: var(--space) 0 0;
      }

      small {
        position: absolute;
        top: var(--space);
        right: var(--space);
        font-size: 0.8em;
        font-family: monospace;
        word-break: break-all;
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }
    }

    &__generator {
      position: sticky;
      top: 0;
      height: 100vh;

      iframe {
        position: relative;
        width: 100%;
        height: 100%;
        border: none;
      }
    }

    .loading {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
