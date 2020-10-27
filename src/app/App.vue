<template>
  <div id="app">
    <v-app>
      <v-app-bar app color="white" flat>
        <v-container class="py-0 fill-height">
          <nav>
            <router-link to="/" exact>
              <v-avatar class="mr-10 home-link" size="48">
                <img src="/public/vue48.png" />
              </v-avatar>
            </router-link>
            <router-link to="/hospitals">
              <v-btn>Hospitals</v-btn>
            </router-link>
            <router-link to="/admin">
              <v-btn>Admin</v-btn>
            </router-link>
          </nav>

          <v-spacer></v-spacer>

          <v-responsive max-width="260">
            <v-text-field
              dense
              flat
              hide-details
              rounded
              solo-inverted
            ></v-text-field>
          </v-responsive>
        </v-container>
      </v-app-bar>
      <v-main>
        <transition name="fade" mode="out-in">
          <v-container>
            <router-view class="view"></router-view>
          </v-container>
        </transition>
      </v-main>
    </v-app>
  </div>
</template>

<style lang="scss">
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

a {
  text-decoration: none;
}

nav a {
  text-decoration: none;
}

nav button {
  margin-right: 1rem;
}

.home-link {
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
