<script setup lang="ts">
import CategoryService from '@/services/CategoryService';
import PriorityService from '@/services/PriorityService';
import TaskService from '@/services/TaskService';
import { useAuthStore } from '@/stores/auth';
import type { ICategory } from '@/types/ICategory';
import type { IPriority } from '@/types/IPriority';
import type { ITask } from '@/types/ITask';
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { id } = router.currentRoute.value.params;
const task = ref<ITask | null>(null);
const authStore = useAuthStore();
const error = reactive<{ message: string | null }>({ message: null });
const priorities = ref<IPriority[]>([]);
const categories = ref<ICategory[]>([]);

onMounted(async () => {
    try {
        if (authStore && id) {
            const taskResponse = await TaskService.view(authStore.jwt!, id as string);
            if (taskResponse.data) {
                task.value = taskResponse.data;
            } else {
                console.error("Error fetching task details:", taskResponse.errors);
            }

            const priorityResponse = await PriorityService.getAll(authStore.jwt!);
            if (priorityResponse.data) {
                priorities.value = priorityResponse.data;
            } else {
                console.error("Error fetching priority details:", priorityResponse.errors);
            }
        
            const categoryResponse = await CategoryService.getAll(authStore.jwt!);
            if (categoryResponse.data) {
                categories.value = categoryResponse.data;
            } else {
                console.error("Error fetching category details:", categoryResponse.errors);
            }
        }
    } catch (error) {
        console.error("Error fetching details:", error);
    }
});

const handleDeleteTask = async () => {
    try {
        if (!authStore || !authStore.jwt) {
            throw new Error('User info or token is not available');
        }
        
        const response = await TaskService.delete(authStore.jwt!, id as string);
        if (response.data === null) {
            console.log('Task deleted successfully');
            router.push('/tasks/TaskList');
        } else {
            throw new Error(response.errors?.[0] || 'Error deleting task.');
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.message = err.message || 'Error deleting task.';
        } else {
            error.message = 'Error deleting task.';
        }
    }
};

const getCategoryName = (categoryId: string): string => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Unknown';
};

const getPriorityName = (priorityId: string): string => {
    const priority = priorities.value.find(pri => pri.id === priorityId);
    return priority ? priority.priorityName : 'Unknown';
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
        <h1>Delete Task</h1>
        <p v-if="error.message" style="color: red">{{ error.message }}</p>
        <p v-if="task">
            Are you sure you want to delete this task?
        </p>
        <template v-if="task">
            <p v-if="task">Name: {{ task.taskName }}</p>
            <p v-if="task">Sort: {{ task.taskSort }}</p>
            <p v-if="task">CreatedAt: {{ formatDate(task.syncDt) }}</p>
            <p v-if="task">IsCompleted: {{ task.isCompleted ? '✔' : '❌' }}</p>
            <p v-if="task">IsArchived: {{ task.isArchived ? '✔' : '❌' }}</p>
            <p v-if="task">Category: {{ getCategoryName(task.todoCategoryId) }}</p>
            <p v-if="task">Priority: {{ getPriorityName(task.todoPriorityId) }}</p>
        </template>
        <button @click="handleDeleteTask">Yes, delete</button>
        <router-link to="/tasks/TaskList">No, go back</router-link>
    </div>
</template>
