import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
    );
};

export default Login;