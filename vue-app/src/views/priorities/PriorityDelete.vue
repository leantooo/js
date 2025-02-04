<script setup lang="ts">
import CategoryService from '@/services/CategoryService';
import PriorityService from '@/services/PriorityService';
import { useAuthStore } from '@/stores/auth';
import type { ICategory } from '@/types/ICategory';
import type { IPriority } from '@/types/IPriority';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { id } = router.currentRoute.value.params;
const priority = ref<IPriority | null>(null);

const error = reactive<{ message: string | null }>({ message: null });

const authStore = useAuthStore();

onMounted(async () => {
    try {
        if (authStore && id) {
            const response = await PriorityService.view(authStore.jwt!, id as string);
            if (response.data) {
                priority.value = response.data;
            } else {
                error.message = response.errors?.[0] || 'Error fetching priority details.';
            }
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.message = err.message || 'Error fetching priority details.';
        } else {
            error.message = 'Error fetching priority details.';
        }
    }
});

const handleDeletePriority = async () => {
    try {
        if (!authStore || !authStore.jwt) {
            throw new Error('User info or token is not available');
        }
        
        const response = await PriorityService.delete(authStore.jwt!, id as string);
        if (response.data === null) {
            console.log('Priority deleted successfully');
            router.push('/priorities/PriorityList');
        } else {
            throw new Error(response.errors?.[0] || 'Error deleting priority.');
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.message = err.message || 'Error deleting priority.';
        } else {
            error.message = 'Error deleting priority.';
        }
    }
};

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
    <div>
        <h1>Delete Priority</h1>
        <p v-if="error.message" style="color: red">{{ error.message }}</p>
        <p v-if="priority">
            Are you sure you want to delete this priority?
        </p>
        <template v-if="priority">
            <p>Name: {{ priority.priorityName }}</p>
            <p>Sort: {{ priority.prioritySort }}</p>
            <p>Sync Date: {{ formatDate(priority.syncDt) }}</p>
        </template>
        <button @click="handleDeletePriority">Yes, delete</button>
        <router-link to="/priorities/PriorityList">No, go back</router-link>
    </div>
</template>
