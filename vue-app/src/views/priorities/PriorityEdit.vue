<script setup lang="ts">
import PriorityService from '@/services/PriorityService';
import { useAuthStore } from '@/stores/auth';
import type { IPriority } from '@/types/IPriority';
import { useParams } from 'next/navigation';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { id } = router.currentRoute.value.params;
const authStore = useAuthStore();

const priorityName = ref('');
const prioritySort = ref(0);

onMounted(async () => {
    if (authStore && id) {
        try {
            const response = await PriorityService.view(authStore.jwt!, id as string);
            if (response.data) {
                priorityName.value = response.data.priorityName;
                prioritySort.value = response.data.prioritySort;
            }
        } catch (error) {
            console.error('Error fetching priority details:', error);
        }
    }
});

const handleEditPriority = async () => {
    if (!authStore || !authStore.jwt) {
        console.error('User token is not available');
        return;
    }

    const updatedPriority: IPriority = {
        id: id as string,
        priorityName: priorityName.value,
        prioritySort: prioritySort.value,
        tag: 'string',
        syncDt: new Date().toISOString(),
    };

    try {
        const response = await PriorityService.edit(authStore.jwt, id as string, updatedPriority);
        if (response.data) {
            console.log('Priority edited:', response.data);
            router.push('/priorities/PriorityList');
        }
    } catch (error) {
        console.error('Error editing priority:', error);
    }
};
</script>

<template>
    <div>
        <h1>Edit Priority</h1>
        <form
            @submit.prevent="handleEditPriority"
            style="display: flex; flex-direction: column; gap: 5px; max-width: 300px;"
        >
            <label for="priorityName">Priority Name:</label>
            <input
                type="text"
                id="priorityName"
                v-model="priorityName"
            />
            <label for="prioritySort">Priority Sort:</label>
            <input
                type="number"
                id="prioritySort"
                v-model.number="prioritySort"
            />
            <div style="display: flex; gap: 1em;">
                <button type="submit">Save</button>
                <router-link to="/priorities/PriorityList">No, back to priorities</router-link>
            </div>
        </form>
    </div>
</template>
