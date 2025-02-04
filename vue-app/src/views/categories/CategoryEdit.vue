<script setup lang="ts">
import CategoryService from '@/services/CategoryService';
import { useAuthStore } from '@/stores/auth';
import type { ICategory } from '@/types/ICategory';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { id } = router.currentRoute.value.params;
const authStore = useAuthStore();

const categoryName = ref('');
const categorySort = ref(0);

onMounted(async () => {
    if (authStore && id) {
        try {
            const response = await CategoryService.view(authStore.jwt!, id as string);
            if (response.data) {
                categoryName.value = response.data.categoryName;
                categorySort.value = response.data.categorySort;
            }
        } catch (error) {
            console.error('Error fetching category details:', error);
        }
    }
});


const handleEditCategory = async () => {
    if (!authStore || !authStore.jwt) {
        console.error('User token is not available');
        return;
    }

    const updatedCategory: ICategory = {
        id: id as string,
        categoryName: categoryName.value,
        categorySort: categorySort.value,
        tag: 'string',
        syncDt: new Date().toISOString(),
    };

    try {
        const response = await CategoryService.edit(authStore.jwt, id as string, updatedCategory);
        if (response.data) {
            console.log('Category edited:', response.data);
            router.push('/categories/CategoryList');
        }
    } catch (error) {
        console.error('Error editing category:', error);
    }
};
</script>

<template>
    <div>
        <h1>Edit Category</h1>
        <form
            @submit.prevent="handleEditCategory"
            style="display: flex; flex-direction: column; gap: 5px; max-width: 300px;"
        >
            <label for="categoryName">Category Name:</label>
            <input
                type="text"
                id="categoryName"
                v-model="categoryName"
            />
            <label for="categorySort">Category Sort:</label>
            <input
                type="number"
                id="categorySort"
                v-model.number="categorySort"
            />
            <div style="display: flex; gap: 1em;">
                <button type="submit">Save</button>
                <router-link to="/categories/CategoryList">No, back to categories</router-link>
            </div>
        </form>
    </div>
</template>
