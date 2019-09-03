<template>
  <div
    class="sidebar"
    :data-color="activeColor"
    :data-image="backgroundImage"
    :style="sidebarStyle"
  >
    <div class="logo">
      <a href="#" class="simple-text logo-mini">
        <div class="logo-img">
          <img :src="imgLogo" alt="" />
        </div>
      </a>
      <span class="site-title">{{ title }}</span>
    </div>
    <div class="sidebar-wrapper">
      <slot name="content"></slot>
      <md-list class="nav">
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            :link="link"
          >
          </sidebar-link>
        </slot>
      </md-list>
    </div>
  </div>
</template>
<script>
import SideBarLink from './SideBarLink.vue';

export default {
  components: {
    SideBarLink
  },
  props: {
    title: {
      type: String,
      default: "Vue"
    },
    backgroundImage: {
      type: String,
      default: require('@/assets/themes/vue-material-dashboard-master/img/sidebar-2.jpg')
    },
    imgLogo: {
      type: String,
      default: require('@/assets/themes/vue-material-dashboard-master/img/vue-logo.png')
    },
    activeColor: {
      type: String,
      default: "green",
      validator: value => {
        let acceptedValues = ["", "purple", "blue", "green", "orange", "red"];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    sidebarLinks: {
      type: Array,
      default: () => []
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`
      };
    }
  }
};
</script>
<style>
@media screen and (min-width: 991px) {
  .nav-mobile-menu {
    display: none;
  }

  .logo-mini {
    &.simple-text {
      display: flex;
      flex-flow: column;
      flex: 1;
      justify-content: center;
      align-items: center;
    }
  }

  .site-title {
    display: flex;
    flex-flow: column;
    flex: 3;
    justify-content: center;
    align-items: flex-start;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
