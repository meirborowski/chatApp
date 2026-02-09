"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "../../services/api";
import { MessageSquare } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let user;
      if (isRegistering) {
        user = await register(formData.username, formData.password, formData.displayName);
      } else {
        user = await login(formData.username, formData.password);
      }
      
      // Store user in local storage (simple auth for demo)
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/");
    } catch (err) {
      setError(isRegistering ? "Registration failed. Try a different username." : "Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
           <MessageSquare size={28} />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          {isRegistering ? "Create your account" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {isRegistering && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Display Name
              </label>
              <div className="mt-2">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : (isRegistering ? "Sign up" : "Sign in")}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {isRegistering ? "Already have an account? " : "Not a member? "}
          <button 
            onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
            }} 
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {isRegistering ? "Sign in" : "Register now"}
          </button>
        </p>
      </div>
    </div>
  );
}
