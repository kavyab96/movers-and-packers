import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { loginService } from "../../services/authServices";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/features/userSlice";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    let newErrors = {};

    // email
    if (!formData.email.trim()) {
      newErrors.name = "Email is required";
    }

    // pswd
    if (!formData.password.trim()) {
      newErrors.name = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true)
    if (validate()) {
      try {
        const res = await loginService(formData);
        setErrors({});
        toast.success("Login successful!");
        dispatch(saveUser(res.data.userExists))
        const role = res.data.userExists.role;

        navigate(`/${role}/dashboard`)
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.error || "Login failed");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } finally {
        setFormData({ email: "", password: "" });
      }
    }
  }


  return (
    // <div className="flex justify-center items-center min-h-screen bg-background pt-24">
    // <div className="flex justify-center items-center min-h-[calc(100vh-96px)] bg-background">
    <div className="flex justify-center items-center min-h-[calc(100vh-96px)] bg-linear-to-br from-background to-muted">


      <Card className="w-full max-w-sm shadow-lg ">
        {/* <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Access your account securely</CardDescription>
        </CardHeader> */}

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back 👋
          </CardTitle>
          <CardDescription className="text-sm">
            Sign in to continue to <span className="font-medium">TransitBee</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Email Input Group */}
            <div className="grid gap-1">
              <Label>Email</Label>
              <div className="flex items-center border rounded-md px-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="you@example.com"
                  className="border-0 focus-visible:ring-0"
                  required
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

              </div>
            </div>

            {/* Password Input Group */}
            <div className="grid gap-1">
              <Label>Password</Label>
              <div className="flex items-center border rounded-md px-3">
                <Lock className="h-4 w-4 text-muted-foreground" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="border-0 focus-visible:ring-0"
                  name="password"
                  value={formData.password}
                  required
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              </div>

              {/* Forgot Password Link */}
              {/* <div className="flex justify-end mt-1">
                <a
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div> */}
            </div>

            <Button className="w-full bg-linear-to-r from-green-200 to-sky-400 opacity-70 hover:opacity-100">
              Login</Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          Don’t have an account?

          <Link to="/signup" className="text-primary ml-1">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
