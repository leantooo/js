<script setup lang="ts">
import AccountService from '@/services/AccountService';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');
const validationError = ref('');

const handleRegistration = async () => {
    try {
        if (email.value.length < 5 || password.value.length < 6) {
            validationError.value = "Email and password must be at least 5 and 6 characters long respectively.";
            return;
        }

        if (password.value !== confirmPassword.value) {
            validationError.value = "Passwords do not match.";
            return;
        }
        const response = await AccountService.register(email.value, password.value, firstName.value, lastName.value);

        if (response.data) {
            console.log('Registration success');
            router.push("/login");
        } else if (response.errors) {
            validationError.value = response.errors[0];
        }
    } catch (error) {
        console.error("Registration error:", error);
        validationError.value = "Registration failed. Please try again later.";
    }
};
</script>

<template>
    <div class="row">
        <div class="col-md-5">
            <h2>Register</h2>
            <hr />
            <div class="text-danger" role="alert">{{ validationError }}</div>
            <div class="form-floating mb-3">
                <input v-model="email" id="email" type="email" class="form-control" autocomplete="email" placeholder="name@example.com" />
                <label for="email" class="form-label">Email</label>
            </div>
            <div class="form-floating mb-3">
                <input v-model="password" id="password" type="password" class="form-control" autocomplete="new-password" placeholder="password" />
                <label for="password" class="form-label">Password</label>
            </div>
            <div class="form-floating mb-3">
                <input v-model="confirmPassword" id="confirmPassword" type="password" class="form-control" autocomplete="new-password" placeholder="confirm password" />
                <label for="confirmPassword" class="form-label">Confirm Password</label>
            </div>
            <div class="form-floating mb-3">
                <input v-model="firstName" id="firstName" type="text" class="form-control" autocomplete="given-name" placeholder="First Name" />
                <label for="firstName" class="form-label">First Name</label>
            </div>
            <div class="form-floating mb-3">
                <input v-model="lastName" id="lastName" type="text" class="form-control" autocomplete="family-name" placeholder="Last Name" />
                <label for="lastName" class="form-label">Last Name</label>
            </div>
            <div>
                <button @click.prevent="handleRegistration" class="w-100 btn btn-lg btn-primary">Register</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
