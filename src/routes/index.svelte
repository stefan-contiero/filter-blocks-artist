<script context="module">
  export const load = async ({ page, fetch }) => {
    try {
      const getTokens = await fetch(`/api/token`);
      const result = await getTokens.json();
      const { projectFolder, imageExtension, aspectRatio } = result;

      const tokens = [];
      const features = {};

      result.tokens.forEach((t) => {
        const token = {
          hash: t.hash,
          tokenId: t.tokenId
        };

        tokens.push(token);

        for (const [feature, name] of Object.entries(t.features)) {
          if (features[feature] === undefined) {
            features[feature] = {};
          }

          if (features[feature][name] === undefined) {
            features[feature][name] = {
              tokens: [],
              active: false
            };
          }

          features[feature][name].tokens.push(token);
        }
      });

      return {
        props: {
          aspectRatio,
          projectFolder,
          imageExtension,
          tokens,
          features
        }
      };
    } catch (error) {
      return {
        status: 404,
        error
      };
    }
  };
</script>

<script type="text/javascript">
  import { onMount } from 'svelte';

  import Image from '$lib/components/image/index.svelte';

  const perPage = 21;

  export let tokens;
  export let features;
  export let projectFolder;
  export let imageExtension;
  export let aspectRatio;

  let filtered = tokens;

  let active = {
    filters: []
  };

  Object.keys(features).forEach((k) => (active[k] = []));

  let opened = {};
  let currentPage = 1;

  $: lastPage = Math.ceil(filtered.length / perPage);
  $: pages = calculatePages(currentPage, lastPage);

  const projectId = Math.floor(tokens[0].tokenId / 1000000);
  const getTokenId = (tokenId) => tokenId - projectId * 1000000;

  const getFiltered = (results) =>
    results
      .reduce((p, c) => p.filter((e) => c.map((a) => a.hash).includes(e.hash)))
      .sort((a, b) => a.tokenId - b.tokenId);

  const calculateFilters = () => {
    const results = active.filters.reduce((r, a) => {
      if (r[a.feature] === undefined) {
        r[a.feature] = [];
      }

      r[a.feature].push(...a.tokens);
      return r;
    }, {});

    filtered = !active.filters.length ? tokens : getFiltered(Object.values(results));
  };

  const totalResultsForFilter = (feature, name) => {
    const results = active.filters.reduce((r, a) => {
      if (a.feature !== feature) {
        if (r[a.feature] === undefined) {
          r[a.feature] = [];
        }

        r[a.feature].push(...a.tokens);
      }

      return r;
    }, {});

    results[feature] = Object.values(features[feature])
      .map((n) => n.tokens)
      .flat();

    return getFiltered([...Object.values(results), features[feature][name].tokens]).length;
  };

  const toggleOpenFeature = ({ target }) => {
    const { feature } = target.dataset;
    if (opened.feature === feature) {
      opened = {};
      return;
    }

    const totals = {};
    Object.keys(features[feature]).forEach(
      (name) => (totals[name] = totalResultsForFilter(feature, name))
    );

    opened = {
      feature,
      totals
    };
  };

  const filterUpdated = () => {
    const activeFilters = Object.entries(active).filter(([k, v]) => k !== 'filters' && v.length);
    if (activeFilters.length) {
      window.history.pushState(
        active,
        'Gallery',
        location.pathname + '?' + new URLSearchParams(Object.fromEntries(activeFilters)).toString()
      );
    } else {
      window.history.pushState([], 'Gallery', location.pathname);
    }

    currentPage = 1;
    window.scrollTo(0, 0);
  };

  const clearAllFilters = (updateParams = true) => {
    Object.keys(features).forEach((feature) => {
      active[feature] = [];

      for (name in features[feature]) {
        features[feature][name].active = false;
      }
    });

    active.filters = [];
    opened = {};

    if (updateParams) filterUpdated();
    else window.scrollTo(0, 0);

    filtered = tokens;
  };

  const clearFeatureFilter = (e) => {
    e.stopPropagation();

    const { feature } = e.target.dataset;

    for (name in features[feature]) {
      features[feature][name].active = false;
    }

    active[feature] = [];
    active.filters = active.filters.filter((a) => a.feature !== feature);

    calculateFilters();
    filterUpdated();
  };

  const toggleFilter = ({ target }) => {
    const { feature, name } = target.dataset;

    if (!features[feature][name].active) {
      features[feature][name].active = true;
      active[feature].push(name);
      active.filters.push({ feature, name, tokens: features[feature][name].tokens });
    } else {
      features[feature][name].active = false;
      active[feature] = active[feature].filter((n) => n !== name);
      active.filters = active.filters.filter((a) => !(a.feature === feature && a.name === name));
    }

    calculateFilters();
    filterUpdated();
  };

  const paginate = (items, page = 1) => items.slice(perPage * (page - 1), perPage * page);

  const setPage = ({ target }) => {
    const { page } = target.dataset;
    currentPage = Math.min(Math.max(1, parseInt(page)), lastPage);

    const search = new URLSearchParams(location.search);
    search.set('page', currentPage);

    window.history.pushState(window.history.state, 'Gallery', `${location.pathname}?${search}`);
    window.scrollTo(0, 0);
  };

  const calculatePages = (currentPage, lastPage) => {
    let min = currentPage - 4;
    let max = currentPage + 4;

    min = Math.max(1, min);
    max = Math.min(max, lastPage);

    const totPages = max - min;

    if (totPages < 8) {
      if (min === 1) max = 9;
      else if (max === lastPage) min = lastPage - 8;

      min = Math.max(1, min);
      max = Math.min(max, lastPage);
    }

    pages = [];
    for (let i = min; i <= max; i += 1) {
      pages.push(i);
    }

    return pages;
  };

  const processParams = () => {
    clearAllFilters(false);

    if (location.search) {
      let page = false;

      const search = new URLSearchParams(location.search);
      for (const [feature, name] of search) {
        if (feature === 'page') page = name;
        else if (features[feature]) {
          name.split(',').forEach((name) => {
            if (!features[feature][name]) return;
            features[feature][name].active = true;
            active[feature].push(name);
            active.filters.push({ feature, name, tokens: features[feature][name].tokens });
          });
        }
      }

      calculateFilters();
      currentPage = page
        ? Math.min(Math.max(1, parseInt(page)), Math.ceil(filtered.length / perPage))
        : 1;
    } else {
      currentPage = 1;
      window.scrollTo(0, 0);
    }
  };

  processParams();

  onMount(() => {
    window.addEventListener('popstate', processParams);

    return () => {
      window.removeEventListener('popstate', processParams);
    };
  });
</script>

<svelte:head>
  <title>{projectFolder}</title>
</svelte:head>

<template src="./_template.pug" />

<style lang="scss">
  .gallery {
    display: grid;
    grid-template-columns: 320px 5fr;

    &__sidebar {
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;

      ul {
        list-style: none;
        flex-grow: 2;
      }

      .tokens__count {
        position: sticky;
        top: 0;
        z-index: 10;
        padding: var(--space);
        margin: 0;
        background-color: var(--color-background);

        .clear-filters {
          color: var(--color-text-disclaimer);

          span {
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .feature {
        &__list {
          padding: 0;
          margin: 0;
          font-size: 0.8em;
          line-height: calc(#{$unit} + (1.4ex - 1ch));
          background-color: var(--color-surface);
        }

        &__title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-s) var(--space);
          position: relative;
          cursor: pointer;

          &.opened,
          &:hover {
            background-color: var(--color-surface-hover);
          }

          &:hover {
            color: var(--color-interactive);
          }

          &__arrow {
            font-size: 0.8em;
            color: var(--color-text-note);
          }

          span,
          small,
          &__arrow {
            pointer-events: none;
          }

          small {
            color: var(--color-text-note);
            line-height: inherit;
          }

          &.active .elements {
            color: var(--color-interactive);
          }

          .clear {
            cursor: pointer;
            pointer-events: all;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .value {
        cursor: pointer;
        font-size: 0.8em;

        &__list {
          padding: 0 0 var(--space) var(--space);
          margin: 0;
          background-color: var(--color-surface-hover);
        }

        span {
          pointer-events: none;
        }

        &__separator {
          margin-right: var(--space-xs);
          color: var(--color-text-disclaimer);
        }

        &__count {
          color: var(--color-text-note);
        }

        &.active,
        &:hover {
          color: var(--color-interactive);
        }

        &.disabled {
          opacity: 0.4;
          pointer-events: none;
        }
      }
    }

    &__tokens {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--space);
      padding: var(--space-m);
      margin: 0;
      list-style: none;

      a {
        display: block;
      }

      small {
        display: inline-block;
        margin-top: var(--space-xs);
      }

      &__pagination {
        position: sticky;
        bottom: 0;
        display: flex;
        grid-column: 2 / -1;
        align-items: center;
        justify-content: center;
        padding: var(--space-s) var(--space-m);
        background-color: var(--color-surface);
        font-size: 0.8em;

        .pages {
          font-variant-numeric: tabular-nums;

          .a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 2em;
            min-height: 2em;
            border-radius: 100%;
            margin: 0 0.2em;
            cursor: pointer;
            transition: none;

            &.active {
              color: var(--color-background);
              background-color: var(--color-interactive);
            }
          }
        }

        .a:disabled {
          opacity: 0;
        }
      }
    }
  }
</style>
