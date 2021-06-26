<div class="loader" />

<style lang="scss">
  .loader {
    width: var(--space-m);
    height: var(--space-m);
    border-radius: 50%;
    background: var(--color-background);
    background: linear-gradient(
      to right,
      var(--color-interactive) 10%,
      var(--color-interactive-alpha) 42%
    );
    position: relative;
    animation: loading 1.4s infinite linear;
    transform: translateZ(0);

    &::before {
      width: 50%;
      height: 50%;
      background: var(--color-interactive);
      border-radius: 100% 0 0 0;
      position: absolute;
      top: 0;
      left: 0;
      content: '';
    }

    &::after {
      background: var(--color-background);
      width: 75%;
      height: 75%;
      border-radius: 50%;
      content: '';
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
