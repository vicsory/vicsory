import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Briefcase, Megaphone, Globe, Twitter, Github, Linkedin, Shield } from "lucide-react";

export default function AboutMe() {
  const features = useMemo(() => [
    { icon: BookOpen, title: "Create & Teach", desc: "Share your knowledge.", bgColor: "var(--grey)" },
    { icon: DollarSign, title: "Find Investors", desc: "Secure funding.", bgColor: "var(--grey)" },
    { icon: Users, title: "Hire Talent", desc: "Connect with pros.", bgColor: "var(--grey)" },
    { icon: Megaphone, title: "Grow", desc: "Boost your reach.", bgColor: "var(--grey)" },
    { icon: Briefcase, title: "Jobs", desc: "Explore careers.", bgColor: "var(--grey)" },
    { icon: Globe, title: "Community", desc: "Join the world.", bgColor: "var(--grey)" },
    { 
      icon: Shield, 
      title: "Security", 
      desc: "Your data is safe with us. We prioritize robust encryption and strict privacy measures to protect you. Learn more about our security practices.",
      link: "https://vicsory.com/security",
      bgColor: "var(--light-green)" // Changed back to #e6ffe6 since var(--light-green) wasn't defined
    },
  ], []);

  const socialLinks = useMemo(() => [
    { 
      icon: Twitter, 
      href: "https://twitter.com/yourusername", 
      label: "Twitter",
      sanitizedHref: encodeURI("https://twitter.com/yourusername")
    },
    { 
      icon: Github, 
      href: "https://github.com/yourusername", 
      label: "GitHub",
      sanitizedHref: encodeURI("https://github.com/yourusername")
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/in/yourusername", 
      label: "LinkedIn",
      sanitizedHref: encodeURI("https://linkedin.com/in/yourusername")
    },
  ].filter(link => 
    /^https:\/\/(twitter|github|linkedin)\.com\//i.test(link.href)
  ), []);

  const SafeAvatar = () => {
    try {
      return (
        <div className="mt-6 mx-auto w-fit">
          <Avatar 
            className="w-24 h-24 border border-solid" 
            style={{ borderColor: "var(--border-color)" }}
          >
            <AvatarImage 
              src={encodeURI("/assets/jean-kael-augustin.png")} 
              alt="Jean-Kael Augustin" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <AvatarFallback 
              style={{ 
                backgroundColor: "var(--grey)", 
                color: "var(--active-mode)" 
              }}
            >
              JA
            </AvatarFallback>
          </Avatar>
        </div>
      );
    } catch (error) {
      console.error('Avatar rendering failed:', error);
      return (
        <div className="w-24 h-24 mx-auto bg-[var(--grey)] rounded-full flex items-center justify-center">
          JA
        </div>
      );
    }
  };

  return (
    <Card 
      className="w-full max-w-4xl mx-auto bg-[var(--background-primary)] border-none shadow-none"
      role="region"
      aria-label="About Me Section"
    >
      <CardContent className="p-8 space-y-12">
        <div className="text-center">
          <h3
            className="text-4xl md:text-5xl font-semibold tracking-tight"
            style={{ color: "var(--active-mode)" }}
          >
            The{" "}
            <span>
              <span style={{ color: "var(--blue)" }}>V</span>
              <span style={{ color: "var(--hover-blue)" }}>i</span>
              <span style={{ color: "var(--red)" }}>s</span>
              <span style={{ color: "var(--hover-red)" }}>i</span>
              <span style={{ color: "var(--orange)" }}>o</span>
              <span style={{ color: "var(--orange)" }}>n</span>
            </span>{" "}
            Behind Vicsory
          </h3>
          <p
            className="mt-4 text-lg md:text-xl text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            Discover Jean-Kael Augustin, the visionary founder, CEO, and lead developer driving Vicsory, a groundbreaking app revolutionizing the way creators connect and thrive.
          </p>
          <SafeAvatar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((item, index) => {
            const isSecurityFeature = item.title === "Security";
            return (
              <div
                key={index}
                className={`text-center p-3 rounded-lg border border-solid h-[120px] ${
                  isSecurityFeature ? "md:col-span-2" : ""
                }`}
                style={{
                  borderColor: isSecurityFeature ? "green" : "var(--blue)",
                  backgroundColor: item.bgColor,
                }}
                role="group"
                aria-label={item.title}
              >
                <item.icon 
                  size={24}
                  style={{ 
                    color: isSecurityFeature ? "green" : "var(--blue)"
                  }} 
                  aria-hidden="true"
                />
                <p
                  className="mt-1 font-semibold text-sm"
                  style={{ color: "var(--active-mode)" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-2)" }}
                >
                  {item.desc}
                  {isSecurityFeature && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "green", textDecoration: "underline" }}
                      className="ml-1"
                    >
                      here
                    </a>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center space-y-6">
          <p
            className="text-lg italic max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            "Connecting creators to{" "}
            <span>
              <span style={{ color: "var(--blue)" }}>u</span>
              <span style={{ color: "var(--hover-blue)" }}>n</span>
              <span style={{ color: "var(--red)" }}>l</span>
              <span style={{ color: "var(--hover-red)" }}>o</span>
              <span style={{ color: "var(--orange)" }}>c</span>
              <span style={{ color: "var(--orange)" }}>k</span>
            </span>{" "}
            possibilities."
          </p>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.sanitizedHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                style={{ color: "var(--text-2)" }}
                aria-label={`Visit ${social.label} profile`}
                onClick={(e) => {
                  if (!social.sanitizedHref) {
                    e.preventDefault();
                  }
                }}
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}