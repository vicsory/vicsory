"use client";

import { useContext, useState } from "react";
import { Switch } from "@mui/material";
import { ThemeContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogInDialog from "@/components/dialog/LogInDialog";
import GlobalLoading from "@/components/misc/GlobalLoading";
import CustomSnackbar from "@/components/misc/CustomSnackbar";
import Legal from "@/components/misc/Legal";
import AboutMe from "@/components/about/about-me";
import Pricing from "@/components/pricing/pricing";
import Donation from "@/components/donation/donation";
import { SnackbarProps } from "@/types/SnackbarProps";
import { motion } from "framer-motion";
import { PlayStore } from "../../public/icons/playstore";
import { Apple } from "../../public/icons/apple";
import { ArrowRight } from "lucide-react";
import LogoSlider from "@/components/logos/logos";

export default function RootPage() {
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isLoggingAsTest] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    message: "",
    severity: "success",
    open: false,
  });

  const handleLogInClick = () => setIsLogInOpen(true);
  const handleLogInClose = () => setIsLogInOpen(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  if (isLoggingAsTest) return <GlobalLoading />;

  return (
    <main className="bg-[var(--background-primary)] flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 w-full z-50 py-3 px-4 sm:px-6 lg:px-8 bg-[var(--top-bar-bg)] backdrop-blur-lg border-b border-solid"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/favicon.png"
              alt="Vicsory Logo"
              width={28}
              height={28}
              className="drop-shadow-sm"
            />
            <span
              className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight"
              style={{ color: "var(--active-mode)" }}
            >
              vicsory
            </span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6">
            <button
              onClick={() => scrollToSection("features-section")}
              className="text-xs sm:text-sm lg:text-base font-medium hover:text-[var(--blue)] transition-colors duration-300"
              style={{ color: "var(--text-2)" }}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing-section")}
              className="text-xs sm:text-sm lg:text-base font-medium hover:text-[var(--blue)] transition-colors duration-300"
              style={{ color: "var(--text-2)" }}
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("donation-section")}
              className="text-xs sm:text-sm lg:text-base font-medium hover:text-[var(--blue)] transition-colors duration-300"
              style={{ color: "var(--text-2)" }}
            >
              Donate
            </button>
            <Button
              onClick={handleLogInClick}
              className="text-xs sm:text-sm lg:text-base font-medium hover:text-[var(--blue)] transition-colors duration-300 bg-transparent p-0"
              style={{ color: "var(--text-2)" }}
            >
              Log In
            </Button>
            <Switch
              checked={theme === "dark"}
              onChange={toggleTheme}
              inputProps={{ "aria-label": "Toggle dark mode" }}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row border-b border-solid border-[var(--border-color)] pt-[120px] lg:pt-0 lg:min-h-screen">
        {/* Left Column - Text and Login Button */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md lg:max-w-lg flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6"
          >
            <h2
              className="text-4xl md:text-5xl font-semibold tracking-tight"
              style={{ color: "var(--active-mode)" }}
            >
              Unleash Your{" "}
              <span>
                <span style={{ color: "var(--blue)" }}>C</span>
                <span style={{ color: "var(--hover-blue)" }}>r</span>
                <span style={{ color: "var(--red)" }}>e</span>
                <span style={{ color: "var(--hover-red)" }}>a</span>
                <span style={{ color: "var(--orange)" }}>t</span>
                <span style={{ color: "var(--orange)" }}>i</span>
                <span style={{ color: "var(--orange)" }}>v</span>
                <span style={{ color: "var(--orange)" }}>e</span>
              </span>{" "}
              Potential
            </h2>
            <p
              className="mt-4 text-lg md:text-xl text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-2)" }}
            >
              Join a platform where creators and innovators connect to build the future.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
              <Button
                onClick={handleLogInClick}
                className="w-full bg-[var(--blue)] hover:bg-[var(--hover-blue)] text-white sm:w-40 lg:w-48 rounded-full py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-semibold"
              >
                Log In
              </Button>
              <Link className="flex items-center text-md gap-2 hover:text-[var(--hover-blue)] text-[var(--blue)]" href="/explore">
                  Explore without signing in <ArrowRight/>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Preview Image */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-[var(--grey)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full rounded-3xl overflow-hidden border border-solid shadow-xl"
            style={{
              borderColor: "var(--border-color)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Image
              src="/assets/previewapp.png"
              alt="Vicsory App Preview"
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
          </motion.div>
          <LogoSlider/>
        </div>
      </section>

      {/* AboutMe Section */}
      <section
        id="features-section"
        className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-12 bg-[var(--background-primary)]"
      >
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          <AboutMe />
          <Separator className="border-solid border border-[var(--border-color)]" style={{ backgroundColor: "var(--border-color)" }} />
          <section id="pricing-section">
            <Pricing />
          </section>
          <Separator className="border-solid border border-[var(--border-color)]" style={{ backgroundColor: "var(--border-color)" }} />
          <section id="donation-section">
            <Donation />
          </section>
          <Separator className="border-solid border border-[var(--border-color)]" style={{ backgroundColor: "var(--border-color)" }} />
          <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">
              <Link
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-wider hover:scale-105 transition-all duration-300 border border-solid w-full sm:w-auto"
                style={{
                  backgroundColor: "var(--grey)",
                  color: "var(--active-mode)",
                  borderColor: "var(--border-color)",
                }}
              >
                <Apple size="20px" color="var(--active-mode)" />
                App Store
              </Link>
              <Link
                href="https://play.google.com/store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-wider hover:scale-105 transition-all duration-300 border border-solid w-full sm:w-auto"
                style={{
                  backgroundColor: "var(--grey)",
                  color: "var(--active-mode)",
                  borderColor: "var(--border-color)",
                }}
              >
                <PlayStore size="20px" />
                Play Store
              </Link>
            </div>
              
            <p
              className="text-xs sm:text-sm lg:text-base"
              style={{ color: "var(--text-2)" }}
            >
              <span>
                <span style={{ color: "var(--blue)" }}>D</span>
                <span style={{ color: "var(--hover-blue)" }}>o</span>
                <span style={{ color: "var(--red)" }}>w</span>
                <span style={{ color: "var(--hover-red)" }}>n</span>
                <span style={{ color: "var(--orange)" }}>l</span>
                <span style={{ color: "var(--orange)" }}>o</span>
                <span style={{ color: "var(--orange)" }}>a</span>
                <span style={{ color: "var(--orange)" }}>d</span>
              </span>{" "}
              Vicsory now!
            </p>
            <Legal />
          </div>
        </div>
      </section>

      <LogInDialog open={isLogInOpen} handleLogInClose={handleLogInClose} />
      {snackbar.open && (
        <CustomSnackbar
          message={snackbar.message}
          severity={snackbar.severity}
          setSnackbar={setSnackbar}
        />
      )}
    </main>
  );
}