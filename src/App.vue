<template>
  <NotificationContainer />
  <NavBar />
  <router-view />
</template>

<script>
import NotificationContainer from "@/components/NotificationContainer";
import NavBar from "@/components/NavBar";
export default {
  components: {
    NotificationContainer,
    NavBar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
