<script setup lang="ts">
import CategoryService from '@/services/CategoryService';
import PriorityService from '@/services/PriorityService';
import TaskService from '@/services/TaskService';
import { useAuthStore } from '@/stores/auth';
import type { ICategory } from '@/types/ICategory';
import type { IPriority } from '@/types/IPriority';
import type { ITask } from '@/types/ITask';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const taskName = ref('');
const taskSort = ref<number | undefined>(undefined);
const dueTo = ref('');
const isArchived = ref(false);
const isCompleted = ref(false);

const priorities = ref<IPriority[]>([]);
const categories = ref<ICategory[]>([]);

const todoCategoryId = ref(categories.value.length > 0 ? categories.value[0]?.id : '');
const todoPriorityId = ref(priorities.value.length > 0 ? priorities.value[0]?.id : '');

onMounted(async () => {
    try {
        const priorityResponse = await PriorityService.getAll(authStore.jwt!);
        if (priorityResponse.data) {
            priorities.value = priorityResponse.data;
            todoPriorityId.value = priorities.value.length > 0 ? priorities.value[0]?.id : '';

        } else {
            console.error("Error fetching priority details:", priorityResponse.errors);
        }

        const categoryResponse = await CategoryService.getAll(authStore.jwt!);
        if (categoryResponse.data) {
            categories.value = categoryResponse.data;
            todoCategoryId.value = categories.value.length > 0 ? categories.value[0]?.id : '';
        } else {
            console.error("Error fetching category details:", categoryResponse.errors);
        }
    } catch (error) {
        console.error("Error fetching details:", error);
    }
});

const handleCreateTask = async () => {
    try {
        const newTask: Partial<ITask> = {
            taskName: taskName.value,
            taskSort: taskSort.value,
            dueTo: dueTo.value,
            isCompleted: isCompleted.value,
            isArchived: isArchived.value,
            todoCategoryId: todoCategoryId.value,
            todoPriorityId: todoPriorityId.value,
            syncDt: new Date().toISOString()
        };
        const response = await TaskService.add(authStore.jwt!, newTask);
        if (response.data) {
            console.log('Task created:', response.data);
            taskName.value = '';
            taskSort.value = 0;
            dueTo.value = '',
            isCompleted.value = false,
            isArchived.value = false,
            todoCategoryId.value = '',
            todoPriorityId.value = '',
            router.push('/tasks/TaskList');
        } else {
            console.error('Error creating task:', response.errors);
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
};

</script>
  
<template>
    <div>
      <h1>Create Task</h1>
      <form @submit.prevent="handleCreateTask" style="display: flex; flex-direction: column; gap: 5px; max-width: 300px;">
        <label for="taskName">Task Name:</label>
            <input
                type="text"
                id="taskName"
                v-model="taskName"
                placeholder="Enter task name"
                required
            />
            <label for="taskSort">Task Sort:</label>
            <input
                type="number"
                id="taskSort"
                v-model.number="taskSort"
                placeholder="Enter task sort"
                required
            />
            <label for="dueTo">Due To:</label>
            <input
                type="date"
                id="dueTo"
                v-model="dueTo"
            />
            <label for="isCompleted">Is Completed:</label>
            <input
                type="checkbox"
                id="isCompleted"
                v-model="isCompleted"
            />
            <label for="isArchived">Is Archived:</label>
            <input
                type="checkbox"
                id="isArchived"
                v-model="isArchived"
            />
            <label for="todoCategoryId">Category:</label>
            <select id="todoCategoryId" v-model="todoCategoryId" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.categoryName }}
                </option>
            </select>
            <label for="todoPriorityId">Priority:</label>
            <select id="todoPriorityId" v-model="todoPriorityId" required>
                <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
                    {{ priority.priorityName }}
                </option>
            </select>
        <div style="display: flex; gap: 1em;">
          <button type="submit">Create</button>
          <router-link to="/tasks/TaskList">No, back to tasks</router-link>
        </div>
      </form>
    </div>
</template>