// components/login-dialog.tsx
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { logIn, checkUserExists, createUser } from "@/utilities/fetch";
import CircularLoading from "../misc/CircularLoading";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SignUpDialogProps } from "@/types/DialogProps";
import { Google } from "../../../public/icons";

export default function SignUpDialog({ open, handleSignUpClose }: SignUpDialogProps) {
  const [snackbar, setSnackbar] = useState<SnackbarProps>({ 
    message: "", 
    severity: "success", 
    open: false 
  });
  const [isSignUpMode, setIsSignUpMode] = useState(false); // Toggle between login and signup

  const router = useRouter();

  // Login validation schema
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

  // Signup validation schema
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

  // Formik instance
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      name: "",
    },
    validationSchema: isSignUpMode ? signupValidationSchema : loginValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const response = isSignUpMode 
        ? await createUser(JSON.stringify(values))
        : await logIn(JSON.stringify(values));
      
      if (!response.success) {
        setSnackbar({ 
          message: isSignUpMode ? "Something went wrong. Please try again." : response.message, 
          severity: "error", 
          open: true 
        });
        return;
      }
      resetForm();
      handleSignUpClose();
      router.push("/explore");
    },
  });

  const handleSwitchToSignUp = () => {
    formik.resetForm(); // Reset form when switching
    setIsSignUpMode(true);
  };

  const handleSwitchToLogin = () => {
    formik.resetForm(); // Reset form when switching
    setIsSignUpMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleSignUpClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        style={{ 
          backgroundColor: 'var(--background-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <DialogHeader>
          <div className="flex justify-center gap-2 mb-4">
            <Image src="/assets/favicon.png" alt="Vicsory Logo" width={40} height={40} />
          </div>
          <DialogTitle 
            className="text-center" 
            style={{ color: 'var(--active-mode)' }}
          >
            {isSignUpMode ? "Create your account" : "Login to your account"}
          </DialogTitle>
        </DialogHeader>
        <form className={cn("flex flex-col gap-6")} onSubmit={formik.handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username" style={{ color: 'var(--active-mode)' }}>
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
                    backgroundColor: 'var(--grey)',
                    borderColor: formik.touched.username && formik.errors.username 
                      ? 'var(--red)' 
                      : 'var(--border-color)',
                    color: 'var(--active-mode)',
                  }}
                  required
                />
                <span 
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-2)' }}
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
              <Label htmlFor="password" style={{ color: 'var(--active-mode)' }}>
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
                  backgroundColor: 'var(--grey)',
                  borderColor: formik.touched.password && formik.errors.password 
                    ? 'var(--red)' 
                    : 'var(--border-color)',
                  color: 'var(--active-mode)',
                }}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm" style={{ color: 'var(--red)' }}>
                  {formik.errors.password}
                </p>
              )}
            </div>
            {isSignUpMode && (
              <div className="grid gap-2">
                <Label htmlFor="name" style={{ color: 'var(--active-mode)' }}>
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your public name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  style={{
                    backgroundColor: 'var(--grey)',
                    borderColor: formik.touched.name && formik.errors.name 
                      ? 'var(--red)' 
                      : 'var(--border-color)',
                    color: 'var(--active-mode)',
                  }}
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
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-blue)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--blue)'}
              >
                {isSignUpMode ? "Create" : "Login"}
              </Button>
            )}
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span 
                className="relative z-10 px-2 text-muted-foreground"
                style={{ backgroundColor: 'var(--background-primary)', color: 'var(--text-2)' }}
              >
                Or continue with
              </span>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              style={{ borderColor: 'var(--border-color)', color: 'var(--active-mode)' }}
              disabled={isSignUpMode} // Disable GitHub login for signup mode
            >
              <Google/>
              Sign up with Google
            </Button>
          </div>
          <div className="text-center text-sm">
            <span style={{ color: 'var(--text-2)' }}>
              {isSignUpMode ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={isSignUpMode ? handleSwitchToLogin : handleSwitchToSignUp}
              className="underline underline-offset-4 cursor-pointer"
              style={{ color: 'var(--blue)' }}
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