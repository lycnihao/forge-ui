<template>
  <div class="page-footer">
    <div class="copyright">
      Copyright <copyright-outlined />
      <a href="https://koodar.net/" target="_blank"> Koodar </a>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-footer {
  padding: 0 16px;
  text-align: center;

  a {
    font-size: 14px;
    color: fade(fade(#000, 85%), 75%);
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: fade(#000, 45%);
    }
  }

  &-link {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;

    a:not(:last-child) {
      margin-right: 40px;
    }
  }

  .copyright {
    color: fade(fade(#000, 85%), 75%);
    font-size: 14px;
  }
}
</style>
