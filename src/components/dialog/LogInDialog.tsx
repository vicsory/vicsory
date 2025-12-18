// components/login-dialog.tsx
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogInDialogProps } from "@/types/DialogProps";
import { logIn, checkUserExists, createUser } from "@/utilities/fetch";
import { SnackbarProps } from "@/types/SnackbarProps";
import CircularLoading from "../misc/CircularLoading";
import CustomSnackbar from "../misc/CustomSnackbar";

interface FormValues {
  username: string;
  password: string;
  name: string;
}

export default function LogInDialog({ open, handleLogInClose }: LogInDialogProps) {
  const [snackbar, setSnackbar] = useState<SnackbarProps>({ 
    message: "", 
    severity: "success", 
    open: false 
  });
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const router = useRouter();

  const loginValidationSchema = yup.object({
    username: yup
      .string()
      .min(3, "Username should be of minimum 3 characters length.")
      .max(20, "Username should be of maximum 20 characters length.")
      .matches(/^[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/, "Username is invalid")
      .required("Username is required."),
    password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters length.")
      .max(100, "Password should be of maximum 100 characters length.")
      .required("Password is required."),
  });

  const signupValidationSchema = yup.object({
    username: yup
      .string()
      .min(3, "Username should be of minimum 3 characters length.")
      .max(20, "Username should be of maximum 20 characters length.")
      .matches(/^[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/, "Username is invalid")
      .required("Username is required.")
      .test("checkUserExists", "User already exists.", async (value) => {
        if (value) {
          const response = await checkUserExists(value);
          if (response.success) return false;
        }
        return true;
      }),
    password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters length.")
      .max(100, "Password should be of maximum 100 characters length.")
      .required("Password is required."),
    name: yup.string().max(50, "Name should be of maximum 50 characters length."),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      password: "",
      name: "",
    },
    validationSchema: isSignUpMode ? signupValidationSchema : loginValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = isSignUpMode 
          ? await createUser(JSON.stringify(values))
          : await logIn(JSON.stringify(values));
        
        if (!response.success) {
          throw new Error(isSignUpMode 
            ? "Failed to create account" 
            : response.message || "Login failed");
        }
        
        resetForm();
        handleLogInClose();
        router.push("/explore");
      } catch (error) {
        setSnackbar({ 
          message: (error as Error).message,
          severity: "error",
          open: true 
        });
      }
    },
  });

  const handleSwitchToSignUp = () => {
    formik.resetForm();
    setIsSignUpMode(true);
  };

  const handleSwitchToLogin = () => {
    formik.resetForm();
    setIsSignUpMode(false);
  };

  const handleForgotPassword = () => {
    if (!formik.values.username) {
      setSnackbar({
        message: "Please enter your username first",
        severity: "warning",
        open: true
      });
      return;
    }
    // TODO: Implement password reset logic
  };

  return (
    <Dialog open={open} onOpenChange={handleLogInClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        style={{ 
          backgroundColor: 'var(--background-primary)',
          borderColor: 'var(--border)'
        }}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image 
              src="/assets/favicon.png" 
              alt="Vicsory Logo" 
              width={40} 
              height={40} 
            />
          </div>
          <DialogTitle 
            className="text-center text-2xl font-bold text-[var(--text)]"
          >
            {isSignUpMode ? "Sign up for Vicsory" : "Sign in to Vicsory"}
          </DialogTitle>
          <p 
            className="text-center text-base text-[var(--text-secondary)]"
          >
            {isSignUpMode 
              ? "Create your account to join the most successful people"
              : "Enter your credentials to access your account"}
          </p>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-[var(--text)]">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                name="username"
                placeholder="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                className="pl-6"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: formik.touched.username && formik.errors.username 
                    ? 'var(--red)' 
                    : 'var(--border)',
                  color: 'var(--text)',
                }}
                required
                aria-label="Username"
                aria-required="true"
              />
              <span 
                className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text)]"
              >
                @
              </span>
            </div>
            {formik.touched.username && formik.errors.username && (
              <p className="text-sm" style={{ color: 'var(--red)' }}>
                {formik.errors.username}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-[var(--text)]">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: formik.touched.password && formik.errors.password 
                  ? 'var(--red)' 
                  : 'var(--border)',
                color: 'var(--text)',
              }}
              required
              aria-label="Password"
              aria-required="true"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm" style={{ color: 'var(--red)' }}>
                {formik.errors.password}
              </p>
            )}
            {!isSignUpMode && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="ml-auto text-sm underline-offset-4 hover:underline"
                style={{ color: 'var(--blue)' }}
                disabled={formik.isSubmitting}
              >
                Forgot your password?
              </button>
            )}
          </div>
          {isSignUpMode && (
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[var(--text)]">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your public name"
                value={formik.values.name}
                onChange={formik.handleChange}
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: formik.touched.name && formik.errors.name 
                    ? 'var(--red)' 
                    : 'var(--border)',
                  color: 'var(--text)',
                }}
                aria-label="Display name"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm" style={{ color: 'var(--red)' }}>
                  {formik.errors.name}
                </p>
              )}
            </div>
          )}
          {formik.isSubmitting ? (
            <CircularLoading />
          ) : (
            <Button
              type="submit"
              className="w-full"
              style={{
                backgroundColor: 'var(--blue)',
                color: 'white',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--blue-secondary)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--blue)'}
            >
              {isSignUpMode ? "Sign Up" : "Log In"}
            </Button>
          )}
          <div className="text-center text-sm">
            <span className="text-[var(--text)] pr-2">
              {isSignUpMode ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={isSignUpMode ? handleSwitchToLogin : handleSwitchToSignUp}
              className="underline underline-offset-4 cursor-pointer disabled:opacity-50"
              style={{ color: 'var(--blue)' }}
              disabled={formik.isSubmitting}
            >
              {isSignUpMode ? "Log in" : "Sign up"}
            </button>
          </div>
          {snackbar.open && (
            <CustomSnackbar 
              message={snackbar.message} 
              severity={snackbar.severity} 
              setSnackbar={setSnackbar} 
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}