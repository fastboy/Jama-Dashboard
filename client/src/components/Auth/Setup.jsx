import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../utils/ApiService";
import NiceForm from "../NiceViews/NiceForm";
import NiceButton from "../NiceViews/NiceButton";
import NiceInput from "../NiceViews/NiceInput";
import makeToast from "../../utils/ToastUtils";

const Setup = () => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [siteName, setSiteName] = useState("Jama-Dashboard");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const createAdmin = async () => {
        if (!fullName || !username || !siteName || !password) {
            return makeToast("error", "All fields are required.");
        }
        if (password.length < 6) {
            return makeToast("error", "Password must be at least 6 characters long.");
        }
        if (password !== repeatPassword) {
            return makeToast("error", "Passwords do not match.");
        }

        setSaving(true);
        try {
            await ApiService.post('/api/v1/setup', {
                fullName,
                username,
                siteName,
                password,
            });
            makeToast("success", "Administrator created. You can now log in.");
            navigate('/login');
        } catch (error) {
            if (!error.handled) {
                makeToast("error", error.response?.data?.message || "Initial setup failed.");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center w-full">
            <div className="bg-noListingCardBg p-8 rounded-xl shadow-md w-96 border border-noListingCardBorder text-noListingCardText">
                <h2 className="text-2xl mb-2">Initial setup</h2>
                <p className="mb-4 text-sm">Create the first administrator account for Jama-Dashboard.</p>
                <NiceForm onSubmit={createAdmin}>
                    <NiceInput label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                    <NiceInput label="Username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder="Choose a username" />
                    <NiceInput label="Site name" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Jama-Dashboard" />
                    <NiceInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
                    <NiceInput label="Repeat password" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} placeholder="Repeat the password" />
                    <div className="flex items-center justify-end mt-4">
                        <NiceButton label={saving ? "Creating..." : "Create administrator"} className="bg-buttonSuccess text-buttonText ml-auto" onClick={createAdmin} />
                    </div>
                </NiceForm>
            </div>
        </div>
    );
};

export default React.memo(Setup);
