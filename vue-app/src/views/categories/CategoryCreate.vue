<script setup lang="ts">
import CategoryService from '@/services/CategoryService';
import { useAuthStore } from '@/stores/auth';
import type { ICategory } from '@/types/ICategory';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const categoryName = ref('');
const categorySort = ref<number | undefined>(undefined);
const router = useRouter();
const authStore = useAuthStore();

const handleCreateCategory = async () => {
    try {
        const newCategory: Partial<ICategory> = {
            categoryName: categoryName.value,
            categorySort: categorySort.value,
            syncDt: new Date().toISOString()
        };
        const response = await CategoryService.add(authStore.jwt!, newCategory);
        if (response.data) {
            console.log('Category created:', response.data);
            categoryName.value = '';
            categorySort.value = 0;
            router.push('/categories/CategoryList');
        } else {
            console.error('Error creating category:', response.errors);
        }
    } catch (error) {
        console.error('Error creating category:', error);
    }
};

</script>
  
<template>
    <div>
      <h1>Create Category</h1>
      <form @submit.prevent="handleCreateCategory" style="display: flex; flex-direction: column; gap: 5px; max-width: 300px;">
        <label for="categoryName">Category Name:</label>
        <input type="text" id="categoryName" v-model="categoryName" placeholder="Enter category name" required />
        <label for="categorySort">Category Sort:</label>
        <input type="number" id="categorySort" v-model.number="categorySort" placeholder="Enter category sort" required />
        <div style="display: flex; gap: 1em;">
          <button type="submit">Create</button>
          <router-link to="/categories/CategoryList">No, back to categories</router-link>
        </div>
      </form>
    </div>
  </template>
