import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../context/auth";
import { signInAPI, singUpAPI } from "../api/auth";
import InputField from "../components/InputField";
import GlobalError from "../components/GlobalError";

export default function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { globalError, setGlobalError, updateAuthToken } = useAuthContext();

  // Call signIn API
  const signIn = async () => {
    if (email && password) {
      const response = await signInAPI({ email, password });

      if (response.errors) {
        if (response.errors.default) {
          setGlobalError(response.errors.default);
        } else {
          setFormErrors(response.errors);
        }
      } else {
        return response.token;
      }
    }
  };

  // Call singUp API
  const signUp = async () => {
    if (email && password && name && age) {
      const response = await singUpAPI({ email, password, name, age });

      if (response.errors) {
        if (response.errors.default) {
          setGlobalError(response.errors.default);
        } else {
          setFormErrors(response.errors);
        }
      } else {
        return response.token;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    let token;

    if (isLogin) {
      token = await signIn();
    } else {
      token = await signUp();
    }

    // Update the token if loggedIn successfully
    // And navigate the user to the homepage.
    if (token) {
      updateAuthToken(token);
      navigate("/");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {globalError && (
        <GlobalError message={globalError} onClose={() => setGlobalError("")} />
      )}
      <div className="max-w-md w-full space-y-8">
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex justify-center mb-2">
            <img className="w-32 object-cover" src="./logo.png" alt="Logo" />
          </div>

          <h2 className="text-center text-3xl font-bold text-white mb-8">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              error={formErrors.email}
            />

            <InputField
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              error={formErrors.password}
            />

            {!isLogin && (
              <InputField
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                error={formErrors.name}
              />
            )}

            {!isLogin && (
              <InputField
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age (minimum 15)"
                error={formErrors.age}
              />
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-yellow-500 to-orange-500 
                rounded-xl hover:from-yellow-400 hover:to-orange-400 focus:outline-none focus:ring-2 
                focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200
                transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-yellow-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormErrors({});
                  setGlobalError("");
                }}
                className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200"
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
