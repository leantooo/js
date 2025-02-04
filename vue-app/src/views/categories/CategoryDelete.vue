<script setup lang="ts">
import CategoryService from '@/services/CategoryService';
import { useAuthStore } from '@/stores/auth';
import type { ICategory } from '@/types/ICategory';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { id } = router.currentRoute.value.params;
const category = ref<ICategory | null>(null);
const error = reactive<{ message: string | null }>({ message: null });

const authStore = useAuthStore();

onMounted(async () => {
    try {
        if (authStore && id) {
            const response = await CategoryService.view(authStore.jwt!, id as string);
            if (response.data) {
                category.value = response.data;
            } else {
                error.message = response.errors?.[0] || 'Error fetching category details.';
            }
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.message = err.message || 'Error fetching category details.';
        } else {
            error.message = 'Error fetching category details.';
        }
    }
});

const handleDeleteCategory = async () => {
    try {
        if (!authStore || !authStore.jwt) {
            throw new Error('User info or token is not available');
        }
        
        const response = await CategoryService.delete(authStore.jwt!, id as string);
        if (response.data === null) {
            console.log('Category deleted successfully');
            router.push('/categories/CategoryList');
        } else {
            throw new Error(response.errors?.[0] || 'Error deleting category.');
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.message = err.message || 'Error deleting category.';
        } else {
            error.message = 'Error deleting category.';
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
        <h1>Delete Category</h1>
        <p v-if="error.message" style="color: red">{{ error.message }}</p>
        <p v-if="category">
            Are you sure you want to delete this category?
        </p>
        <template v-if="category">
            <p>Name: {{ category.categoryName }}</p>
            <p>Sort: {{ category.categorySort }}</p>
            <p>Sync Date: {{ formatDate(category.syncDt) }}</p>
            <button @click="handleDeleteCategory">Yes, delete</button>
        </template>
        <router-link to="/categories/CategoryList">No, go back</router-link>
    </div>
</template>
