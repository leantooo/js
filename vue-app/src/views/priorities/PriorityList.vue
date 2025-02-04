<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PriorityService from '@/services/PriorityService';
import type { IPriority } from '@/types/IPriority';
import type { IResultObject } from '@/types/IResultObject';

const priorities = ref<IPriority[]>([]);
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
    const result: IResultObject<IPriority[]> = await PriorityService.getAll(user.token);
    if (result.data) {
        priorities.value = result.data;
    } else {
        errors.value = result.errors || ['Unknown error'];
    }
    isLoading.value = false;
});

</script>

<template>
    <div>
        <h1>Priorities</h1>
        
        <p v-if="errors.length">
            Error loading priorities:
            <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
        </p>

        <p v-if="isLoading">Priorities - LOADING</p>
        
        <div v-else>
            <p>
                <router-link to="/priorities/PriorityCreate">Create New</router-link>
            </p>
            <table class="table">
                <thead>
                    <tr>
                        <th>Priority Name</th>
                        <th>Priority Sort</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="priority in priorities" :key="priority.id">
                        <td>{{ priority.priorityName }}</td>
                        <td>{{ priority.prioritySort }}</td>
                        <td>
                            <router-link :to="`/priorities/PriorityEdit/${priority.id}`">Edit</router-link> |
                            <router-link :to="`/priorities/PriorityView/${priority.id}`">Details</router-link> |
                            <router-link :to="`/priorities/PriorityDelete/${priority.id}`">Delete</router-link>
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
