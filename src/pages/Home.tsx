import React from "react";

const Home: React.FC = () => {
    return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
                <p className="text-lg text-gray-700">This is a simple React application using Tailwind CSS.</p>
            </div>
    )
};

export default Home;