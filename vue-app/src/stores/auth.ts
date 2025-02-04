import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { stringOrNull } from '@/types/types'

export const useAuthStore = defineStore('auth', () => {
    // ref - state variables
    const jwt = ref<stringOrNull>(null)
    const refreshToken = ref<stringOrNull>(null)
    const userName = ref<stringOrNull>(null)

    // computed - getters
    const isAuthenticated = computed<boolean>(() => !!jwt.value);

    // functions - actions
    const logout = () => {
        jwt.value = null;
        refreshToken.value = null;
        userName.value = null;
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
    }

    // return your refs, computeds and functions
    return { jwt, refreshToken, userName, isAuthenticated, logout }
})
