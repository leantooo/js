<script setup lang="ts">
import PriorityService from '@/services/PriorityService';
import { useAuthStore } from '@/stores/auth';
import type { IPriority } from '@/types/IPriority';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const priorityName = ref('');
const prioritySort = ref<number | undefined>(undefined);
const router = useRouter();
const authStore = useAuthStore();

const handleCreateCategory = async () => {
    try {
        const newCategory: Partial<IPriority> = {
            priorityName: priorityName.value,
            prioritySort: prioritySort.value,
            syncDt: new Date().toISOString()
        };
        const response = await PriorityService.add(authStore.jwt!, newCategory);
        if (response.data) {
            console.log('Category created:', response.data);
            priorityName.value = '';
            prioritySort.value = 0;
            router.push('/priorities/PriorityList');
        } else {
            console.error('Error creating priority:', response.errors);
        }
    } catch (error) {
        console.error('Error creating priority:', error);
    }
};

</script>
  
<template>
    <div>
      <h1>Create Category</h1>
      <form @submit.prevent="handleCreateCategory" style="display: flex; flex-direction: column; gap: 5px; max-width: 300px;">
        <label for="priorityName">Category Name:</label>
        <input type="text" id="priorityName" v-model="priorityName" placeholder="Enter category name" required />
        <label for="prioritySort">Category Sort:</label>
        <input type="number" id="prioritySort" v-model.number="prioritySort" placeholder="Enter category sort" required />
        <div style="display: flex; gap: 1em;">
          <button type="submit">Create</button>
          <router-link to="/priorities/PriorityList">No, back to categories</router-link>
        </div>
      </form>
    </div>
  </template>
