<template>
  <li class="md-list-item">
    <router-link
      class="md-list-item-router md-list-item-container md-button-clean"
      @click="hideSideBar"
      v-bind="$attrs"
    >
      <div class="md-list-item-content md-ripple">
        <slot>
          <md-icon>{{ link.icon }}</md-icon>
          <p>{{ link.name }}</p>
        </slot>
      </div>
    </router-link>
  </li>
</template>
<script>
export default {
  inject: {
    autoClose: {
      default: true
    }
  },
  props: {
    link: {
      type: [String, Object],
      default: () => {
        return {
          name: "",
          path: "",
          icon: ""
        };
      }
    },
    tag: {
      type: String,
      default: "router-link"
    }
  },
  methods: {
    hideSideBar() {
      if (
        this.autoClose &&
        this.$sidebar &&
        this.$sidebar.showSideBar === true
      ) {
        this.$sidebar.displaySideBar(false);
      }
    }
  }
};
</script>
<style></style>
