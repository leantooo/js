<template>
  <header>
    <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
      <div class="container">
        <router-link class="navbar-brand" to="/">WebApp</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
          <ul class="navbar-nav flex-grow-1">
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/categories/CategoryList">Categories</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/priorities/PriorityList">Priorities</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark" to="/tasks/TaskList">Tasks</router-link>
            </li>
          </ul>

          <ul class="navbar-nav">
            <template v-if="!authStore.isAuthenticated">
              <li class="nav-item">
                <router-link class="nav-link text-dark" to="/login">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-dark" to="/register">Register</router-link>
              </li>
            </template>
            <template v-else>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Hello, {{ authStore.userName }}!
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a class="dropdown-item" @click="doLogout">Logout</a>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const doLogout = () => {
  authStore.logout();
  router.push('/login');
}
</script>
