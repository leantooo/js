<script setup lang="ts">
import PriorityService from '@/services/PriorityService';
import { onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { IPriority } from '@/types/IPriority';

const { id } = useRouter().currentRoute.value.params;
const priority = ref<IPriority | null>(null);
const authStore = useAuthStore();

onMounted(async () => {
    try {
        const response = await PriorityService.view(authStore.jwt!, id as string);
        if (response.data) {
            priority.value = response.data;
        } else {
            console.error("Error fetching priority details:", response.errors);
        }
    } catch (error) {
        console.error("Error fetching priority details:", error);
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
      <h1>Priority Details</h1>
      <p v-if="priority" class="text-sm font-medium text-gray-600">
        Priority Name:&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="ml-4 text-gray-900">{{ priority.priorityName }}</span>
      </p>
      <p v-if="priority" class="text-sm font-medium text-gray-600">
        Priority Sort:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="ml-4 text-gray-900">{{ priority.prioritySort }}</span>
      </p>
      <p v-if="priority" class="text-sm font-medium text-gray-600">
        Priority Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="ml-4 text-gray-900">{{ formatDate(priority.syncDt) }}</span>
      </p>
      <div style="display: flex; gap: 1em;">
        <router-link v-if="priority" :to="`/priorities/PriorityEdit/${id}`">Edit</router-link>
        <router-link to="/priorities/PriorityList">No, back to priorities</router-link>
      </div>
    </div>
</template>
