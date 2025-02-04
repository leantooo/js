<script setup lang="ts">
import CategoryService from '@/services/CategoryService';
import { onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { ICategory } from '@/types/ICategory';

const { id } = useRouter().currentRoute.value.params;
const category = ref<ICategory | null>(null);
const authStore = useAuthStore();

onMounted(async () => {
    try {
        const response = await CategoryService.view(authStore.jwt!, id as string);
        if (response.data) {
            category.value = response.data;
        } else {
            console.error("Error fetching category details:", response.errors);
        }
    } catch (error) {
        console.error("Error fetching category details:", error);
    }
});

const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', '');
};

</script>
  
<template>
    <div class="bg-white shadow-md rounded-md p-4">
      <h1>Category Details</h1>
      <p v-if="category" class="text-sm font-medium text-gray-600">
        Category Name:&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="ml-4 text-gray-900">{{ category.categoryName }}</span>
      </p>
      <p v-if="category" class="text-sm font-medium text-gray-600">
        Category Sort:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="ml-4 text-gray-900">{{ category.categorySort }}</span>
      </p>
      <p v-if="category" class="text-sm font-medium text-gray-600">
        Category Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="ml-4 text-gray-900">{{ formatDate(category.syncDt) }}</span>
      </p>
      <div style="display: flex; gap: 1em;">
        <router-link v-if="category" :to="`/categories/CategoryEdit/${id}`">Edit</router-link>
        <router-link to="/categories/CategoryList">No, back to categories</router-link>
      </div>
    </div>
  </template>
  