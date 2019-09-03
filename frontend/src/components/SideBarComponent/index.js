import SideBar from './SideBar.vue'
import SideBarLink from './SideBarLink.vue';

const SideBarStore = {
  showSideBar: false,
  displaySideBar(value) {
    this.showSideBar = value;
  }
};

const SideBarComponent = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          sideBarStore: SideBarStore
        };
      }
    });

    Object.defineProperty(Vue.prototype, "$sidebar", {
      get() {
        return this.$root.sideBarStore;
      }
    });
    Vue.component("side-bar", SideBar);
    Vue.component("sidebar-link", SideBarLink);
  }
};

export default SideBarComponent;
