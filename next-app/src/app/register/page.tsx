"use client"

import AccountService from "@/services/AccountService";
import { AppContext } from "@/state/AppContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [validationError, setValidationError] = useState("");

    const { setUserInfo } = useContext(AppContext)!;

    const handleRegistration = async () => {
        try {
            if (email.length < 5 || password.length < 6) {
                setValidationError("Email and password must be at least 5 and 6 characters long respectively.");
                return;
            }

            if (password !== confirmPassword) {
                setValidationError("Passwords do not match.");
                return;
            }

            const response = await AccountService.register(email, password, firstName, lastName);
            if (response.data) {
                const loginResponse = await AccountService.login(email, password);
                if (loginResponse.data) {
                    setUserInfo(loginResponse.data);
                    localStorage.setItem('jwt', response.data.token);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    router.push("/");
                } else if (loginResponse.errors) {
                    setValidationError(loginResponse.errors[0]);
                }
            } else if (response.errors) {
                setValidationError(response.errors[0]);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setValidationError("Registration failed. Please try again later.");
        }
    };

    return (
        <div className="row">
            <div className="col-md-5">
                <h2>Register</h2>
                <hr />
                <div className="text-danger" role="alert">{validationError}</div>
                <div className="form-floating mb-3">
                    <input
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setValidationError(""); }}
                        id="email" type="email" className="form-control" autoComplete="email" placeholder="name@example.com" />
                    <label htmlFor="email" className="form-label">Email</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setValidationError(""); }}
                        id="password" type="password" className="form-control" autoComplete="new-password" placeholder="password" />
                    <label htmlFor="password" className="form-label">Password</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setValidationError(""); }}
                        id="confirmPassword" type="password" className="form-control" autoComplete="new-password" placeholder="confirm password" />
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setValidationError(""); }}
                        id="firstName" type="text" className="form-control" autoComplete="given-name" placeholder="First Name" />
                    <label htmlFor="firstName" className="form-label">First Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); setValidationError(""); }}
                        id="lastName" type="text" className="form-control" autoComplete="family-name" placeholder="Last Name" />
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                </div>
                <div>
                    <button onClick={handleRegistration} className="w-100 btn btn-lg btn-primary">Register</button>
                </div>
            </div>
        </div>
    );
}
