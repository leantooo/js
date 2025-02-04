<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CategoryService from '@/services/CategoryService';
import type { ICategory } from '@/types/ICategory';
import type { IResultObject } from '@/types/IResultObject';

const categories = ref<ICategory[]>([]);
const isLoading = ref(true);
const errors = ref<string[]>([]);
const router = useRouter();

onMounted(async () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
        router.push('/login');
        return;
    }

    const user = JSON.parse(storedUserInfo);
    const result: IResultObject<ICategory[]> = await CategoryService.getAll(user.token);
    if (result.data) {
        categories.value = result.data;
    } else {
        errors.value = result.errors || ['Unknown error'];
    }
    isLoading.value = false;
});

</script>

<template>
    <div>
        <h1>Categories</h1>
        
        <p v-if="errors.length">
            Error loading categories:
            <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
        </p>

        <p v-if="isLoading">Categories - LOADING</p>
        
        <div v-else>
            <p>
                <router-link to="/categories/CategoryCreate">Create New</router-link>
            </p>
            <table class="table">
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Category Sort</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in categories" :key="category.id">
                        <td>{{ category.categoryName }}</td>
                        <td>{{ category.categorySort }}</td>
                        <td>
                            <router-link :to="`/categories/CategoryEdit/${category.id}`">Edit</router-link> |
                            <router-link :to="`/categories/CategoryView/${category.id}`">Details</router-link> |
                            <router-link :to="`/categories/CategoryDelete/${category.id}`">Delete</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.table {
    width: 100%;
    border-collapse: collapse;
}

.table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.table th {
    background-color: #f2f2f2;
    text-align: left;
}

.table tr:hover {
    background-color: #f1f1f1;
}
</style>
