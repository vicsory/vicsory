"use client";

import Image from "next/image";
import { formatDateForProfile } from "@/utilities/date";
import { socialMediaBaseUrls } from "./constants";
import { ProfileProps } from "@/types/UserProps";
import { Link, XIcon } from "lucide-react";
import { AiOutlineLink, BiCalendarCheck, FaFacebook, FaInstagram, FaTiktok, FaTwitch, FaYoutube, SiBluesky } from "./imports";

export default function SocialLinks({ profile }: ProfileProps) {
  const socialLinks = [
    { name: "TikTok", url: profile.tiktok ? `${socialMediaBaseUrls.tiktok}${profile.tiktok}` : null, icon: <FaTiktok size={20} /> },
    { name: "YouTube", url: profile.youtube ? `${socialMediaBaseUrls.youtube}${profile.youtube}` : null, icon: <FaYoutube size={20} /> },
    { name: "Facebook", url: profile.facebook ? `${socialMediaBaseUrls.facebook}${profile.facebook}` : null, icon: <FaFacebook size={20} /> },
    { name: "X", url: profile.x ? `${socialMediaBaseUrls.x}${profile.x}` : null, icon: <XIcon size={20} /> },
    { name: "Instagram", url: profile.instagram ? `${socialMediaBaseUrls.instagram}${profile.instagram}` : null, icon: <FaInstagram size={20} /> },
    { name: "Twitch", url: profile.twitch ? `${socialMediaBaseUrls.twitch}${profile.twitch}` : null, icon: <FaTwitch size={20} /> },
    { name: "Bluesky", url: profile.bluesky ? `${socialMediaBaseUrls.bluesky}${profile.bluesky}` : null, icon: <SiBluesky size={20} /> },
  ].filter(link => link.url);

  return (
    <div className="flex items-center gap-4 text-[var(--text-secondary)] text-[14px] mt-2 px-4">
      {profile.website && (
        <div className="flex items-center gap-1">
          <AiOutlineLink size={16} />{" "}
          <Link className="text-[var(--blue)] hover:underline truncate max-w-[200px]" href={"https://" + profile.website} target="_blank">
            {profile.website}
          </Link>
        </div>
      )}
      {profile.whatsapp && (
        <div className="flex items-center gap-1">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            width={16}
            height={16}
          />
          <Link
            className="text-[var(--blue)] hover:underline truncate max-w-[200px]"
            href={`https://wa.me/${profile.whatsapp}`}
            target="_blank"
          >
            {profile.whatsapp}
          </Link>
        </div>
      )}
      <div className="flex items-center gap-1">
        <BiCalendarCheck size={16} /> 
        <span>Joined {formatDateForProfile(new Date(profile.createdAt))}</span>
      </div>
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url!}
              target="_blank"
              className="hover:text-[var(--blue)] transition-colors"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}