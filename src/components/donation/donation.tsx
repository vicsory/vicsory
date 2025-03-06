import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Donation() {
  const [amount, setAmount] = useState<number | string>("");
  const predefinedAmounts = [5, 10, 25, 50];

  const handleAmountSelect = (value: number) => setAmount(value);
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : parseFloat(value) || "");
  };

  const handleDonate = () => {
    if (!amount || (typeof amount === "number" && amount <= 0)) {
      alert("Please enter a valid donation amount.");
      return;
    }
    console.log(`Donating $${amount} to Vicsory`);
    alert(`Thank you for donating $${amount} to Vicsory!`);
    setAmount("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto text-center"
    >
      <h2
        className="text-4xl md:text-5xl font-semibold tracking-tight"
        style={{ color: "var(--active-mode)" }}
      >
        <span>
          <span style={{ color: "var(--blue)" }}>S</span>
          <span style={{ color: "var(--hover-blue)" }}>u</span>
          <span style={{ color: "var(--red)" }}>p</span>
          <span style={{ color: "var(--hover-red)" }}>p</span>
          <span style={{ color: "var(--orange)" }}>o</span>
          <span style={{ color: "var(--orange)" }}>r</span>
          <span style={{ color: "var(--orange)" }}>t</span>
        </span>{" "}
        Vicsory
      </h2>
      <p
        className="mt-4 text-lg md:text-xl text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed"
        style={{ color: "var(--text-2)" }}
      >
        Fuel a community of creators and innovators.
      </p>
      <Card
        className="mt-8 bg-[var(--background-primary)] border-none shadow-none"
      >
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            {predefinedAmounts.map((value) => (
              <Button
                key={value}
                onClick={() => handleAmountSelect(value)}
                className="rounded-full px-6 py-2 text-sm font-semibold tracking-wide hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: amount === value ? "var(--blue)" : "var(--grey)",
                  color: amount === value ? "#ffffff" : "var(--active-mode)",
                }}
              >
                ${value}
              </Button>
            ))}
          </div>
          <div className="mt-6 max-w-sm mx-auto">
            <Input
              id="custom-amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={handleCustomAmountChange}
              placeholder="Enter your amount"
              className="rounded-full text-center text-[var(--active-mode)] bg-[var(--grey)] border border-solid focus:ring-0 focus:border-[var(--blue)] transition-all duration-200"
              style={{ borderColor: "var(--border-color)" }}
            />
          </div>
          <Button
            onClick={handleDonate}
            className="w-full max-w-xs mx-auto rounded-full px-8 py-3 text-sm font-semibold"
            style={{
              backgroundColor: "var(--blue)",
              color: "#ffffff",
            }}
          >
            Donate Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}