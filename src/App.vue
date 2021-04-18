<template>
  <NotificationContainer />
  <NavBar />
  <router-view />
</template>

<script>
import M from "materialize-css";
import NotificationContainer from "@/components/NotificationContainer";
import NavBar from "@/components/NavBar";
import { onMounted } from "vue";
export default {
  components: {
    NotificationContainer,
    NavBar,
  },
  setup() {
    onMounted(() => {
      M.AutoInit();
    });
  },
};
</script>

<style>
html {
  background-color: #dae0e6;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
* {
  padding: 0%;
  margin: 0%;
}
.profile-image {
  border-radius: 50%;
}

form {
  margin-left: auto;
  margin-right: auto;
  width: 30%;
  display: block;
  text-align: left;
}
@media only screen and (max-width: 1300px) {
  form {
    width: 40%;
  }
}

@media only screen and (max-width: 992px) {
  form {
    width: 60%;
  }
}
a.router-link-exact-active {
  cursor: default;
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}
.noSelect {
  cursor: default;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
::-moz-selection {
  background: #c9e2ff85;
}
::selection {
  background: #c9e2ff85;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #6f8691;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b808b;
}
::-webkit-scrollbar-thumb:active {
  background: #546e7a;
}
</style>
