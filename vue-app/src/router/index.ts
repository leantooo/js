import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
    { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
    { path: '/categories/CategoryList', name: 'CategoryList', component: () => import('@/views/categories/CategoryList.vue') },
    { path: '/categories/CategoryCreate', name: 'CategoryCreate', component: () => import('@/views/categories/CategoryCreate.vue') },
    { path: '/categories/CategoryDelete/:id', name: 'CategoryDelete', component: () => import('@/views/categories/CategoryDelete.vue') },
    { path: '/categories/CategoryView/:id', name: 'CategoryView', component: () => import('@/views/categories/CategoryView.vue') },
    { path: '/categories/CategoryEdit/:id', name: 'CategoryEdit', component: () => import('@/views/categories/CategoryEdit.vue') },
    { path: '/priorities/PriorityList', name: 'PriorityList', component: () => import('@/views/priorities/PriorityList.vue') },
    { path: '/priorities/PriorityCreate', name: 'PriorityCreate', component: () => import('@/views/priorities/PriorityCreate.vue') },
    { path: '/priorities/PriorityDelete/:id', name: 'PriorityDelete', component: () => import('@/views/priorities/PriorityDelete.vue') },
    { path: '/priorities/PriorityView/:id', name: 'PriorityView', component: () => import('@/views/priorities/PriorityView.vue') },
    { path: '/priorities/PriorityEdit/:id', name: 'PriorityEdit', component: () => import('@/views/priorities/PriorityEdit.vue') },
    { path: '/tasks/TaskList', name: 'TaskList', component: () => import('@/views/tasks/TaskList.vue') },
    { path: '/tasks/TaskCreate', name: 'TaskCreate', component: () => import('@/views/tasks/TaskCreate.vue') },
    { path: '/tasks/TaskDelete/:id', name: 'TaskDelete', component: () => import('@/views/tasks/TaskDelete.vue') },
    { path: '/tasks/TaskView/:id', name: 'TaskView', component: () => import('@/views/tasks/TaskView.vue') },
    { path: '/tasks/TaskEdit/:id', name: 'TaskEdit', component: () => import('@/views/tasks/TaskEdit.vue') }
  ]
});

export default router;
