import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Apple } from "../../../../public/icons/apple";
import { PlayStore } from "../../../../public/icons/playstore";
import { ArrowUpRight } from "lucide-react";

interface Cta10Props {
  onLogInClick?: () => void;
}

interface Cta10Props {
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Cta10 = ({
  heading = "Call to Action",
  description = "Build faster with our collection of pre-built blocks. Speed up your development and ship features in record time.",
  buttons = {
    primary: {
      text: "Buy Now",
      url: "https://www.shadcnblocks.com",
    },
  },
  onLogInClick
}: Cta10Props) => {
  return (
    <section>
      <div className="container">
        <div className="bg-slate-100 flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12">

          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </h3>
            <p className="text-muted max-w-xl lg:text-lg">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start pt-4">
              <Button
                onClick={onLogInClick}
                size="lg"
                className="h-12 px-8 rounded-xl bg-[#0056d2] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Get Started
                <ArrowUpRight className="h-5 w-5" />
              </Button>
              <Link
                href="https://apps.apple.com/app/vicsory/id123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-5 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-md flex-1 sm:flex-none"
              >
                <Apple />
                App Store
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.vicsory.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-5 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-md flex-1 sm:flex-none"
              >
                <PlayStore />
                Google Play
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Image
              src="/assets/devicemockup.png"
              alt="Vicsory app on mobile device"
              width={600}
              height={1200}
              priority
              className="w-full h-auto drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta10 };
