"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaRegEnvelope, FaTiktok, FaTwitch, FaYoutube } from "react-icons/fa";
import { BiCalendarCheck } from "react-icons/bi";
import { AiOutlineLink } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, X, Plus, Video, PersonStanding, Building, NotebookPen, Code, Paintbrush,
  School, Banknote, Briefcase,
  Gavel, Gift, GraduationCap, Home, Megaphone,
  Rocket, Sparkles, Store,
  Play,
  VolumeX,
  Volume2,
  Factory,
  HeartPulse,
  Users,
  Cpu,
  Puzzle,
  BanknoteIcon,
  Settings,
  Handshake,
  StoreIcon,
} from "lucide-react";
import User from "./User";
import "flag-icons/css/flag-icons.min.css";
import { formatDateForProfile } from "@/utilities/date";
import { UserProps } from "@/types/UserProps";
import PostArrayLength from "../post/PostArrayLength";
import Follow from "./Follow";
import { SnackbarProps } from "@/types/SnackbarProps";
import CustomSnackbar from "../misc/CustomSnackbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import XIcon from "../../../public/svg/x";
import {
  Rewind,
  FastForward,
  Repeat,
  Maximize,
} from "lucide-react";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../public/svg/verify-badge";
import PreviewDialog from "../dialog/PreviewDialog";
import NewMessageDialog from "../dialog/NewMessageDialog";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { AuthContext } from "@/contexts/auth-context";
import VideoSelector from "./components/profile/VideoSelector";
import SuggestedUserCard from "../misc/SuggestedUserCard";
import { Button } from "../ui/button";
import BackToArrow from "../misc/BackToArrow";

// Comprehensive list of countries with ISO codes (same as EditProfile)
const countryOptions = [
  { value: "AF", label: "Afghanistan", code: "af" },
  { value: "AX", label: "Åland Islands", code: "ax" },
  { value: "AL", label: "Albania", code: "al" },
  { value: "DZ", label: "Algeria", code: "dz" },
  { value: "AS", label: "American Samoa", code: "as" },
  { value: "AD", label: "Andorra", code: "ad" },
  { value: "AO", label: "Angola", code: "ao" },
  { value: "AI", label: "Anguilla", code: "ai" },
  { value: "AQ", label: "Antarctica", code: "aq" },
  { value: "AG", label: "Antigua and Barbuda", code: "ag" },
  { value: "AR", label: "Argentina", code: "ar" },
  { value: "AM", label: "Armenia", code: "am" },
  { value: "AW", label: "Aruba", code: "aw" },
  { value: "AU", label: "Australia", code: "au" },
  { value: "AT", label: "Austria", code: "at" },
  { value: "AZ", label: "Azerbaijan", code: "az" },
  { value: "BS", label: "Bahamas", code: "bs" },
  { value: "BH", label: "Bahrain", code: "bh" },
  { value: "BD", label: "Bangladesh", code: "bd" },
  { value: "BB", label: "Barbados", code: "bb" },
  { value: "BY", label: "Belarus", code: "by" },
  { value: "BE", label: "Belgium", code: "be" },
  { value: "BZ", label: "Belize", code: "bz" },
  { value: "BJ", label: "Benin", code: "bj" },
  { value: "BM", label: "Bermuda", code: "bm" },
  { value: "BT", label: "Bhutan", code: "bt" },
  { value: "BO", label: "Bolivia", code: "bo" },
  { value: "BQ", label: "Bonaire, Sint Eustatius and Saba", code: "bq" },
  { value: "BA", label: "Bosnia and Herzegovina", code: "ba" },
  { value: "BW", label: "Botswana", code: "bw" },
  { value: "BV", label: "Bouvet Island", code: "bv" },
  { value: "BR", label: "Brazil", code: "br" },
  { value: "IO", label: "British Indian Ocean Territory", code: "io" },
  { value: "BN", label: "Brunei Darussalam", code: "bn" },
  { value: "BG", label: "Bulgaria", code: "bg" },
  { value: "BF", label: "Burkina Faso", code: "bf" },
  { value: "BI", label: "Burundi", code: "bi" },
  { value: "CV", label: "Cabo Verde", code: "cv" },
  { value: "KH", label: "Cambodia", code: "kh" },
  { value: "CM", label: "Cameroon", code: "cm" },
  { value: "CA", label: "Canada", code: "ca" },
  { value: "KY", label: "Cayman Islands", code: "ky" },
  { value: "CF", label: "Central African Republic", code: "cf" },
  { value: "TD", label: "Chad", code: "td" },
  { value: "CL", label: "Chile", code: "cl" },
  { value: "CN", label: "China", code: "cn" },
  { value: "CX", label: "Christmas Island", code: "cx" },
  { value: "CC", label: "Cocos (Keeling) Islands", code: "cc" },
  { value: "CO", label: "Colombia", code: "co" },
  { value: "KM", label: "Comoros", code: "km" },
  { value: "CG", label: "Congo", code: "cg" },
  { value: "CD", label: "Congo, Democratic Republic of the", code: "cd" },
  { value: "CK", label: "Cook Islands", code: "ck" },
  { value: "CR", label: "Costa Rica", code: "cr" },
  { value: "CI", label: "Côte d'Ivoire", code: "ci" },
  { value: "HR", label: "Croatia", code: "hr" },
  { value: "CU", label: "Cuba", code: "cu" },
  { value: "CW", label: "Curaçao", code: "cw" },
  { value: "CY", label: "Cyprus", code: "cy" },
  { value: "CZ", label: "Czech Republic", code: "cz" },
  { value: "DK", label: "Denmark", code: "dk" },
  { value: "DJ", label: "Djibouti", code: "dj" },
  { value: "DM", label: "Dominica", code: "dm" },
  { value: "DO", label: "Dominican Republic", code: "do" },
  { value: "EC", label: "Ecuador", code: "ec" },
  { value: "EG", label: "Egypt", code: "eg" },
  { value: "SV", label: "El Salvador", code: "sv" },
  { value: "GQ", label: "Equatorial Guinea", code: "gq" },
  { value: "ER", label: "Eritrea", code: "er" },
  { value: "EE", label: "Estonia", code: "ee" },
  { value: "SZ", label: "Eswatini", code: "sz" },
  { value: "ET", label: "Ethiopia", code: "et" },
  { value: "FK", label: "Falkland Islands (Malvinas)", code: "fk" },
  { value: "FO", label: "Faroe Islands", code: "fo" },
  { value: "FJ", label: "Fiji", code: "fj" },
  { value: "FI", label: "Finland", code: "fi" },
  { value: "FR", label: "France", code: "fr" },
  { value: "GF", label: "French Guiana", code: "gf" },
  { value: "PF", label: "French Polynesia", code: "pf" },
  { value: "TF", label: "French Southern Territories", code: "tf" },
  { value: "GA", label: "Gabon", code: "ga" },
  { value: "GM", label: "Gambia", code: "gm" },
  { value: "GE", label: "Georgia", code: "ge" },
  { value: "DE", label: "Germany", code: "de" },
  { value: "GH", label: "Ghana", code: "gh" },
  { value: "GI", label: "Gibraltar", code: "gi" },
  { value: "GR", label: "Greece", code: "gr" },
  { value: "GL", label: "Greenland", code: "gl" },
  { value: "GD", label: "Grenada", code: "gd" },
  { value: "GP", label: "Guadeloupe", code: "gp" },
  { value: "GU", label: "Guam", code: "gu" },
  { value: "GT", label: "Guatemala", code: "gt" },
  { value: "GG", label: "Guernsey", code: "gg" },
  { value: "GN", label: "Guinea", code: "gn" },
  { value: "GW", label: "Guinea-Bissau", code: "gw" },
  { value: "GY", label: "Guyana", code: "gy" },
  { value: "HT", label: "Haiti", code: "ht" },
  { value: "HM", label: "Heard Island and McDonald Islands", code: "hm" },
  { value: "VA", label: "Holy See", code: "va" },
  { value: "HN", label: "Honduras", code: "hn" },
  { value: "HK", label: "Hong Kong", code: "hk" },
  { value: "HU", label: "Hungary", code: "hu" },
  { value: "IS", label: "Iceland", code: "is" },
  { value: "IN", label: "India", code: "in" },
  { value: "ID", label: "Indonesia", code: "id" },
  { value: "IR", label: "Iran", code: "ir" },
  { value: "IQ", label: "Iraq", code: "iq" },
  { value: "IE", label: "Ireland", code: "ie" },
  { value: "IM", label: "Isle of Man", code: "im" },
  { value: "IL", label: "Israel", code: "il" },
  { value: "IT", label: "Italy", code: "it" },
  { value: "JM", label: "Jamaica", code: "jm" },
  { value: "JP", label: "Japan", code: "jp" },
  { value: "JE", label: "Jersey", code: "je" },
  { value: "JO", label: "Jordan", code: "jo" },
  { value: "KZ", label: "Kazakhstan", code: "kz" },
  { value: "KE", label: "Kenya", code: "ke" },
  { value: "KI", label: "Kiribati", code: "ki" },
  { value: "KP", label: "Korea, Democratic People's Republic of", code: "kp" },
  { value: "KR", label: "Korea, Republic of", code: "kr" },
  { value: "KW", label: "Kuwait", code: "kw" },
  { value: "KG", label: "Kyrgyzstan", code: "kg" },
  { value: "LA", label: "Lao People's Democratic Republic", code: "la" },
  { value: "LV", label: "Latvia", code: "lv" },
  { value: "LB", label: "Lebanon", code: "lb" },
  { value: "LS", label: "Lesotho", code: "ls" },
  { value: "LR", label: "Liberia", code: "lr" },
  { value: "LY", label: "Libya", code: "ly" },
  { value: "LI", label: "Liechtenstein", code: "li" },
  { value: "LT", label: "Lithuania", code: "lt" },
  { value: "LU", label: "Luxembourg", code: "lu" },
  { value: "MO", label: "Macao", code: "mo" },
  { value: "MG", label: "Madagascar", code: "mg" },
  { value: "MW", label: "Malawi", code: "mw" },
  { value: "MY", label: "Malaysia", code: "my" },
  { value: "MV", label: "Maldives", code: "mv" },
  { value: "ML", label: "Mali", code: "ml" },
  { value: "MT", label: "Malta", code: "mt" },
  { value: "MH", label: "Marshall Islands", code: "mh" },
  { value: "MQ", label: "Martinique", code: "mq" },
  { value: "MR", label: "Mauritania", code: "mr" },
  { value: "MU", label: "Mauritius", code: "mu" },
  { value: "YT", label: "Mayotte", code: "yt" },
  { value: "MX", label: "Mexico", code: "mx" },
  { value: "FM", label: "Micronesia", code: "fm" },
  { value: "MD", label: "Moldova", code: "md" },
  { value: "MC", label: "Monaco", code: "mc" },
  { value: "MN", label: "Mongolia", code: "mn" },
  { value: "ME", label: "Montenegro", code: "me" },
  { value: "MS", label: "Montserrat", code: "ms" },
  { value: "MA", label: "Morocco", code: "ma" },
  { value: "MZ", label: "Mozambique", code: "mz" },
  { value: "MM", label: "Myanmar", code: "mm" },
  { value: "NA", label: "Namibia", code: "na" },
  { value: "NR", label: "Nauru", code: "nr" },
  { value: "NP", label: "Nepal", code: "np" },
  { value: "NL", label: "Netherlands", code: "nl" },
  { value: "NC", label: "New Caledonia", code: "nc" },
  { value: "NZ", label: "New Zealand", code: "nz" },
  { value: "NI", label: "Nicaragua", code: "ni" },
  { value: "NE", label: "Niger", code: "ne" },
  { value: "NG", label: "Nigeria", code: "ng" },
  { value: "NU", label: "Niue", code: "nu" },
  { value: "NF", label: "Norfolk Island", code: "nf" },
  { value: "MP", label: "Northern Mariana Islands", code: "mp" },
  { value: "NO", label: "Norway", code: "no" },
  { value: "OM", label: "Oman", code: "om" },
  { value: "PK", label: "Pakistan", code: "pk" },
  { value: "PW", label: "Palau", code: "pw" },
  { value: "PS", label: "Palestine, State of", code: "ps" },
  { value: "PA", label: "Panama", code: "pa" },
  { value: "PG", label: "Papua New Guinea", code: "pg" },
  { value: "PY", label: "Paraguay", code: "py" },
  { value: "PE", label: "Peru", code: "pe" },
  { value: "PH", label: "Philippines", code: "ph" },
  { value: "PN", label: "Pitcairn", code: "pn" },
  { value: "PL", label: "Poland", code: "pl" },
  { value: "PT", label: "Portugal", code: "pt" },
  { value: "PR", label: "Puerto Rico", code: "pr" },
  { value: "QA", label: "Qatar", code: "qa" },
  { value: "RE", label: "Réunion", code: "re" },
  { value: "RO", label: "Romania", code: "ro" },
  { value: "RU", label: "Russian Federation", code: "ru" },
  { value: "RW", label: "Rwanda", code: "rw" },
  { value: "BL", label: "Saint Barthélemy", code: "bl" },
  { value: "SH", label: "Saint Helena", code: "sh" },
  { value: "KN", label: "Saint Kitts and Nevis", code: "kn" },
  { value: "LC", label: "Saint Lucia", code: "lc" },
  { value: "MF", label: "Saint Martin", code: "mf" },
  { value: "PM", label: "Saint Pierre and Miquelon", code: "pm" },
  { value: "VC", label: "Saint Vincent and the Grenadines", code: "vc" },
  { value: "WS", label: "Samoa", code: "ws" },
  { value: "SM", label: "San Marino", code: "sm" },
  { value: "ST", label: "Sao Tome and Principe", code: "st" },
  { value: "SA", label: "Saudi Arabia", code: "sa" },
  { value: "SN", label: "Senegal", code: "sn" },
  { value: "RS", label: "Serbia", code: "rs" },
  { value: "SC", label: "Seychelles", code: "sc" },
  { value: "SL", label: "Sierra Leone", code: "sl" },
  { value: "SG", label: "Singapore", code: "sg" },
  { value: "SX", label: "Sint Maarten", code: "sx" },
  { value: "SK", label: "Slovakia", code: "sk" },
  { value: "SI", label: "Slovenia", code: "si" },
  { value: "SB", label: "Solomon Islands", code: "sb" },
  { value: "SO", label: "Somalia", code: "so" },
  { value: "ZA", label: "South Africa", code: "za" },
  { value: "GS", label: "South Georgia and the South Sandwich Islands", code: "gs" },
  { value: "SS", label: "South Sudan", code: "ss" },
  { value: "ES", label: "Spain", code: "es" },
  { value: "LK", label: "Sri Lanka", code: "lk" },
  { value: "SD", label: "Sudan", code: "sd" },
  { value: "SR", label: "Suriname", code: "sr" },
  { value: "SJ", label: "Svalbard and Jan Mayen", code: "sj" },
  { value: "SE", label: "Sweden", code: "se" },
  { value: "CH", label: "Switzerland", code: "ch" },
  { value: "SY", label: "Syrian Arab Republic", code: "sy" },
  { value: "TW", label: "Taiwan", code: "tw" },
  { value: "TJ", label: "Tajikistan", code: "tj" },
  { value: "TZ", label: "Tanzania", code: "tz" },
  { value: "TH", label: "Thailand", code: "th" },
  { value: "TL", label: "Timor-Leste", code: "tl" },
  { value: "TG", label: "Togo", code: "tg" },
  { value: "TK", label: "Tokelau", code: "tk" },
  { value: "TO", label: "Tonga", code: "to" },
  { value: "TT", label: "Trinidad and Tobago", code: "tt" },
  { value: "TN", label: "Tunisia", code: "tn" },
  { value: "TR", label: "Turkey", code: "tr" },
  { value: "TM", label: "Turkmenistan", code: "tm" },
  { value: "TC", label: "Turks and Caicos Islands", code: "tc" },
  { value: "TV", label: "Tuvalu", code: "tv" },
  { value: "UG", label: "Uganda", code: "ug" },
  { value: "UA", label: "Ukraine", code: "ua" },
  { value: "AE", label: "United Arab Emirates", code: "ae" },
  { value: "GB", label: "United Kingdom", code: "gb" },
  { value: "US", label: "United States", code: "us" },
  { value: "UM", label: "United States Minor Outlying Islands", code: "um" },
  { value: "UY", label: "Uruguay", code: "uy" },
  { value: "UZ", label: "Uzbekistan", code: "uz" },
  { value: "VU", label: "Vanuatu", code: "vu" },
  { value: "VE", label: "Venezuela", code: "ve" },
  { value: "VN", label: "Vietnam", code: "vn" },
  { value: "VG", label: "Virgin Islands, British", code: "vg" },
  { value: "VI", label: "Virgin Islands, U.S.", code: "vi" },
  { value: "WF", label: "Wallis and Futuna", code: "wf" },
  { value: "EH", label: "Western Sahara", code: "eh" },
  { value: "YE", label: "Yemen", code: "ye" },
  { value: "ZM", label: "Zambia", code: "zm" },
  { value: "ZW", label: "Zimbabwe", code: "zw" },
];

const categoryIcons = {
  None: <PersonStanding size={16} color="#9CA3AF" />,
  Company: <Building size={16} color="#9CA3AF" />,
  Startup: <Rocket size={16} color="#9CA3AF" />,
  Entrepreneur: <Briefcase size={16} color="#9CA3AF" />,
  SmallBusiness: <StoreIcon size={16} color="#9CA3AF" />,
  Freelancer: <NotebookPen size={16} color="#9CA3AF" />,
  Creator: <Sparkles size={16} color="#9CA3AF" />,
  Professional: <PersonStanding size={16} color="#9CA3AF" />,
  Student: <GraduationCap size={16} color="#9CA3AF" />,
  Investor: <Banknote size={16} color="#9CA3AF" />,
  Marketing: <Megaphone size={16} color="#9CA3AF" />,
  Sales: <Handshake size={16} color="#9CA3AF" />,
  Engineering: <Code size={16} color="#9CA3AF" />,
  Product: <Puzzle size={16} color="#9CA3AF" />,
  Design: <Paintbrush size={16} color="#9CA3AF" />,
  Technology: <Cpu size={16} color="#9CA3AF" />,
  Media: <Video size={16} color="#9CA3AF" />,
  Education: <School size={16} color="#9CA3AF" />,
  Consulting: <Megaphone size={16} color="#9CA3AF" />,
  NonProfit: <Gift size={16} color="#9CA3AF" />,
  Government: <Gavel size={16} color="#9CA3AF" />,
  HumanResources: <Users size={16} color="#9CA3AF" />,
  Operations: <Settings size={16} color="#9CA3AF" />,
  Finance: <BanknoteIcon size={16} color="#9CA3AF" />,
  Legal: <Gavel size={16} color="#9CA3AF" />,
  Healthcare: <HeartPulse size={16} color="#9CA3AF" />,
  RealEstate: <Home size={16} color="#9CA3AF" />,
  Manufacturing: <Factory size={16} color="#9CA3AF" />,
  Retail: <Store size={16} color="#9CA3AF" />,
  Other: <PersonStanding size={16} color="#9CA3AF" />,
};


interface ExtendedUserProps extends UserProps {
  youtubePlayerUrls?: { url: string; title: string }[];
}


const socialMediaBaseUrls = {
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
  facebook: "https://facebook.com/",
  x: "https://x.com/",
  instagram: "https://instagram.com/",
  twitch: "https://twitch.tv/",
  bluesky: "https://bsky.app/profile/",
};

export default function Profile({ profile }: { profile: ExtendedUserProps }) {
  const [dialogType, setDialogType] = useState<"followers" | "following" | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [preview, setPreview] = useState({ open: false, url: "" });
  const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });
  const [isCoursePromptVisible, setIsCoursePromptVisible] = useState(true);
  const [setIsScrolled] = useState(false);
  const [followingSearchQuery, setFollowingSearchQuery] = useState("");
  const [followersSearchQuery, setFollowersSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(!!profile.youtubePlayerUrl);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isVisible, setIsVisible] = useState(true);

    const lastScrollY = useRef(0);


  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const scrollingDown = current > lastScrollY.current && current > 100;

      setIsVisible(!scrollingDown);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const allVideos = [
    ...(profile.youtubePlayerUrl ? [{ url: profile.youtubePlayerUrl, title: profile.youtubePlayerTitle || "" }] : []),
    ...(profile.youtubePlayerUrls || []),
  ];

  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(
    allVideos.length > 0 ? allVideos[0] : null
  );

  const { token } = useContext(AuthContext);
  const pathname = usePathname();

  useEffect(() => {
    if (allVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(allVideos[0]);
      setIsPlaying(true);
      setIsMuted(true);
    }
  }, [allVideos]);

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      if (!url) return "";
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      let videoId = "";
      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.split("/")[1];
      }
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`
        : "";
    } catch (error) {
      console.error("Invalid YouTube URL:", error);
      return "";
    }
  };

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying && videoRef.current) {
      setIsMuted(true);
    }
  };

  const handleMuteToggle = () => setIsMuted((prev) => !prev);
  const handleReplay = () => {
    videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[0,true]}', '*');
    setIsPlaying(true);
  };
  const handleSeekBackward = () => {
    videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[-10,true]}', '*');
  };
  const handleSeekForward = () => {
    videoRef.current?.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[10,true]}', '*');
  };
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const socialLinks = [
    { name: "TikTok", url: profile.tiktok ? `${socialMediaBaseUrls.tiktok}${profile.tiktok}` : null, icon: <FaTiktok size={20} /> },
    { name: "YouTube", url: profile.youtube ? `${socialMediaBaseUrls.youtube}${profile.youtube}` : null, icon: <FaYoutube size={20} /> },
    { name: "Facebook", url: profile.facebook ? `${socialMediaBaseUrls.facebook}${profile.facebook}` : null, icon: <FaFacebook size={20} /> },
    { name: "X", url: profile.x ? `${socialMediaBaseUrls.x}${profile.x}` : null, icon: <XIcon size={20} /> },
    { name: "Instagram", url: profile.instagram ? `${socialMediaBaseUrls.instagram}${profile.instagram}` : null, icon: <FaInstagram size={20} /> },
    { name: "Twitch", url: profile.twitch ? `${socialMediaBaseUrls.twitch}${profile.twitch}` : null, icon: <FaTwitch size={20} /> },
  ].filter(link => link.url);


  const handleDialogOpen = (type: "followers" | "following") => {
    if (!token) {
      return setSnackbar({ message: `You need to login first to see the ${type}.`, severity: "info", open: true });
    }
    if (type === "following" && profile.following.length === 0) return;
    if (type === "followers" && profile.followers.length === 0) return;

    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const clickedElement = e.target as HTMLImageElement;
    if (clickedElement.alt === "profile-header") {
      handlePreviewClick(profile.headerUrl ? profile.headerUrl : "/assets/header.jpg");
    }
    if (clickedElement.alt === "profile-photo") {
      handlePreviewClick(profile.photoUrl ? profile.photoUrl : "/assets/egg.jpg");
    }
  };

  const handlePreviewClick = (url: string) => {
    setPreview({ open: true, url });
  };

  const handlePreviewClose = () => {
    setPreview({ open: false, url: "" });
  };

  const handleNewMessageClick = () => {
    if (!token) {
      return setSnackbar({ message: "You need to login first to message someone.", severity: "info", open: true });
    }
    setIsNewMessageOpen(true);
  };

  const handleCloseCoursePrompt = () => {
    setIsCoursePromptVisible(false);
  };

  const isFollowingTokenOwner = () => {
    if (profile.following.length === 0 || !token) return false;
    return profile.following.some((user) => typeof user !== "string" && user.id === token.id);
  };

  const formatCategory = (category: string) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  const firstThreeFollowings = profile.following.filter((user): user is UserProps => typeof user !== "string").slice(0, 3);

  const filteredFollowing = profile.following
    .filter((user): user is UserProps => typeof user !== "string")
    .filter((user) => {
      const name = user.name || "";
      const username = user.username || "";
      return (
        name.toLowerCase().includes(followingSearchQuery.toLowerCase()) ||
        username.toLowerCase().includes(followingSearchQuery.toLowerCase())
      );
    });

  const filteredFollowers = profile.followers
    .filter((user): user is UserProps => typeof user !== "string")
    .filter((user) => {
      const name = user.name || "";
      const username = user.username || "";
      return (
        name.toLowerCase().includes(followersSearchQuery.toLowerCase()) ||
        username.toLowerCase().includes(followersSearchQuery.toLowerCase())
      );
    });

  const getActiveTab = () => {
    if (pathname === `/${profile.username}/replies`) return "replies";
    if (pathname === `/${profile.username}/media`) return "media";
    if (pathname === `/${profile.username}/likes`) return "likes";
    return "posts";
  };

  const isOwner = token?.username === profile.username;

  // Find the country label and code based on the profile.location (ISO code)
  const locationCountry = countryOptions.find(country => country.value === profile.location);
  const locationDisplay = locationCountry ? locationCountry.label : profile.location;


  return (
    <div className="w-full mx-auto px-0 top-0 bg-[var(--background-primary)]">
      {/* Static top bar */}
      <div className={`
          sticky gap-4 px-4 bg-[var(--background-primary)]/80 backdrop-blur-xl flex items-center top-0 inset-0 w-full h-16 z-50 pointer-events-none
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          transition-transform duration-300 ease-out
        `}>
        <BackToArrow title={""} url={""}/>
        <div className="flex flex-col text-[var(--text)]">
          <span className="font-bold text-2xl">{profile.username}</span>
          <PostArrayLength username={profile.username} />
        </div>
      </div>

      <div className="w-full relative mb-2">
        {selectedVideo && isPlaying ? (
          <div className="relative w-full pb-[56.25%]">
            <iframe
              ref={videoRef}
              src={getYoutubeEmbedUrl(selectedVideo.url)}
              title={selectedVideo.title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
              style={{ border: 0 }}
            />
          </div>
        ) : (
          <div className="relative w-full h-[200px] bg-gray-200">
            <Image
              src={profile.headerUrl ? getFullURL(profile.headerUrl) : "/assets/header.jpg"}
              alt="profile-header"
              fill
              className="object-cover cursor-pointer"
              onClick={handleImageClick}
              priority
            />
          </div>
        )}
        {selectedVideo && (
          <>
            <div className="absolute top-4 right-4 flex items-center gap-3 z-20 pl-4">
              {selectedVideo.title && (
                <span className="text-white text-base font-semibold bg-black/70 px-3 py-1 rounded-full shadow-md max-w-[300px] truncate">
                  {selectedVideo.title}
                </span>
              )}
              <Button
                type="button"
                onClick={handlePlayToggle}
                className="w-10 h-10 rounded-full bg-[var(--blue)] hover:bg-[var(--blue-secondary)] flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
                title={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <Play size={18} color="white" className="ml-1" />
                )}
              </Button>
            </div>
            {isPlaying && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20 bg-black/70 p-2 rounded-full">
                <button
                  type="button"
                  onClick={handleSeekBackward}
                  className="w-8 h-8 rounded-full bg-black hover:bg-[var(--blue-secondary)] flex items-center justify-center transition-all duration-200 hover:scale-105"
                  title="Rewind 10 seconds"
                >
                  <Rewind size={16} color="white" />
                </button>
                <button
                  type="button"
                  onClick={handleSeekForward}
                  className="w-8 h-8 rounded-full bg-black hover:bg-[var(--blue-secondary)] flex items-center justify-center transition-all duration-200 hover:scale-105"
                  title="Fast forward 10 seconds"
                >
                  <FastForward size={16} color="white" />
                </button>
                <button
                  type="button"
                  onClick={handleMuteToggle}
                  className="w-8 h-8 rounded-full bg-black hover:bg-[var(--blue-secondary)] flex items-center justify-center transition-all duration-200 hover:scale-105"
                  title={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX size={16} color="white" /> : <Volume2 size={16} color="white" />}
                </button>
                <button
                  type="button"
                  onClick={handleReplay}
                  className="w-8 h-8 rounded-full bg-black hover:bg-[var(--blue-secondary)] flex items-center justify-center transition-all duration-200 hover:scale-105"
                  title="Replay video"
                >
                  <Repeat size={16} color="white" />
                </button>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="w-8 h-8 rounded-full bg-black hover:bg-[var(--blue-secondary)] flex items-center justify-center transition-all duration-200 hover:scale-105"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Maximize size={16} color="white" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Profile photo remains below the video */}
        <div className="cursor-pointer absolute -bottom-[50px] left-4 border border-solid border-[var(--border)] rounded-full p-1 bg-[var(--background-primary)] z-10">
          <div className="border border-solid border-[var(--border)] rounded-full">
            <Avatar className="w-32 h-32 sm:w-32 sm:h-32 border border-solid border-[var(--border)]">
              <AvatarImage
                onClick={handleImageClick}
                src={profile.photoUrl ? getFullURL(profile.photoUrl) : "/assets/egg.jpg"}
                alt="profile-photo"
              />
              <AvatarFallback>{profile.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="mt-[55px] sm:mt-[70px] px-4 flex flex-col gap-2 relative">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-2 text-[var(--text)] text-[20px] font-extrabold">
            {profile.name !== "" ? profile.name : profile.username}
            {profile.category && profile.category !== "NONE" && (
              <span>{categoryIcons[profile.category as keyof typeof categoryIcons]}</span>
            )}
            {profile.isPremium && (
              <div className="flex items-center gap-1">
                <span>
                  <BadgeBlue />
                </span>
              </div>
            )}
            {profile.isVip && (
              <div className="flex items-center gap-1">
                <span>
                  <BadgeGold />
                </span>
              </div>
            )}
            {profile.isElite && (
              <div className="flex items-center gap-1">
                <span>
                  <BadgeRed />
                </span>
              </div>
            )}
          </h1>
          <div className="text-[var(--text-secondary)]">
            @{profile.username}
            {profile.category && profile.category !== "NONE" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="secondary"
                      className="rounded-full text-sm border border-solid border-[var(--border)] hover:border-[var(--border)] ml-2 bg-[var(--background-secondary)] text-[var(--text-secondary)] hover:bg-transparent hover:text-[var(--text-secondary)]  font-normal"
                    >
                      {formatCategory(profile.category)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="p-2 bg-[var(--background-primary)] text-[var(--text-secondary)] rounded-lg shadow-lg">
                    <p>This user is a {formatCategory(profile.category)} enthusiast</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isFollowingTokenOwner() && (
              <span className="text-[13px] font-medium bg-[var(--background-secondary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-lg ml-2">
                Follows you
              </span>
            )}
          </div>
        </div>
        {profile.description && (
          <div className="text-[15px] text-[var(--text)] leading-5 break-words">
            {profile.description}
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-[var(--text-secondary)] text-[15px]">
          {profile.location && (
            <div className="flex items-center gap-2">
              <span className={`fi fi-${locationCountry?.code || "xx"} w-5 h-5 rounded-full`}></span>
              {locationDisplay}
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-2">
              <AiOutlineLink size={16} />{" "}
              <Link className="text-[var(--blue)] hover:underline" href={"https://" + profile.website} target="_blank">
                {profile.website}
              </Link>
            </div>
          )}
          {profile.whatsapp && (
            <div className="flex items-center gap-2">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                width={16}
                height={16}
                className="flex items-center"
              />
              <Link
                className="flex items-center text-[var(--blue)] hover:underline"
                href={`https://wa.me/${profile.whatsapp}`}
                target="_blank"
              >
                {profile.whatsapp}
              </Link>
            </div>
          )}
          <div className="flex items-center gap-2">
            <BiCalendarCheck size={16} /> Joined {formatDateForProfile(new Date(profile.createdAt))}
          </div>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full mt-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-solid border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] hover:text-[var(--blue)] transition-colors duration-200"
                  title={link.name}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          )}

        </div>
        <div className="flex flex-wrap items-center gap-3 text-[15px] ">
          <div
            onClick={() => handleDialogOpen("followers")}
            className="cursor-pointer hover:underline"
          >
            <span className="font-bold text-[var(--text)]">{profile.followers.length}</span>{" "}
            <span className="text-[var(--text-secondary)]">Followers</span>
          </div>
          <div
            onClick={() => handleDialogOpen("following")}
            className="cursor-pointer hover:underline flex items-center gap-2"
          >
            <div className="flex -space-x-1 sm:-space-x-2 items-center">
              {firstThreeFollowings.map((user) => (
                <Avatar key={typeof user === "string" ? user : user.id} className="w-6 h-6 sm:w-8 sm:h-8 border border-solid border-[var(--border)]">
                  <AvatarImage
                    src={typeof user !== "string" && user.photoUrl ? getFullURL(user.photoUrl) : "/assets/egg.jpg"}
                    alt={typeof user === "string" ? user : user.username}
                  />
                  <AvatarFallback>{typeof user === "string" ? (user as string).charAt(0) : user.username.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {profile.following.length > 3 && (
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[var(--background-secondary)] rounded-full border border-solid border-[var(--border)]">
                  <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
              )}
            </div>
            <span className="text-[var(--text-secondary)]">Following</span>
          </div>
        </div>
        <div className="absolute -top-[40px] sm:-top-[60px] right-4 flex gap-2 items-center">
          {token?.username === profile.username ? (
            <Link
              href={`/${profile.username}/edit`}
              className="font-bold text-[var(--text)] text-[15px] py-1 px-3 rounded-full border border-solid border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              Edit profile
            </Link>
          ) : (
            <>
              <button
                className="border border-solid border-[var(--border)] p-1.5 rounded-full hover:bg-[var(--background-secondary)] transition-colors"
                onClick={handleNewMessageClick}
              >
                <FaRegEnvelope className="w-4 h-4 text-[var(--text)]" />
              </button>
              <Follow profile={profile} />
            </>
          )}
        </div>
        {token?.username === profile.username && isCoursePromptVisible && (
          <div className="relative p-4 border border-solid border-gray-200 bg-[var(--yellow)] mt-2 rounded-xl">
            <button
              onClick={handleCloseCoursePrompt}
              className="absolute top-2 right-2 text-black hover:bg-[var(--yellow-secondary)] rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-[18px] font-bold text-black">Start Teaching Today</h2>
              <p className="text-[14px] text-black leading-[18px]">
                You haven’t created any courses yet. Share your knowledge with the community by
                creating your first course now!
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/school"
                  className="px-3 py-1 text-[14px] font-bold text-white hover:border-transparent bg-[var(--blue)] border border-solid border-black rounded-full hover:bg-[var(--blue-secondary)] transition-colors"
                >
                  Create Course
                </Link>
                {!profile.isPremium && (
                  <Link
                    href="/verify"
                    className="flex items-center hover:border-transparent px-3 gap-1 py-1 text-[14px] font-semibold hover:bg-[var(--blue-secondary)] border border-solid border-black text-black hover:text-white bg-transparent rounded-full transition-colors"
                  >
                    <BadgeBlue />
                    Get Verified Now!
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Navigation */}
      <Tabs defaultValue={getActiveTab()} className="w-full mt-2 bg-[var(--background-primary)]">
        <TabsList className="w-full flex justify-around border-b border-solid border-[var(--border)]">
          <TabsTrigger
            value="posts"
            className="text-[15px] text-[var(--text-secondary)] flex items-center justify-center w-full font-bold py-3 relative hover:bg-[var(--background-secondary)] transition-colors duration-100 group data-[state=active]:text-[var(--text)]"
            asChild
          >
            <Link href={`/${profile.username}`} className="relative z-10">
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="replies"
            className="text-[15px] text-[var(--text-secondary)] flex items-center justify-center w-full font-bold py-3 relative hover:bg-[var(--background-secondary)] transition-colors duration-100 group data-[state=active]:text-[var(--text)]"
            asChild
          >
            <Link href={`/${profile.username}/replies`} className="relative z-10">
              <span>Replies</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="text-[15px] text-[var(--text-secondary)] flex items-center justify-center w-full font-bold py-3 relative hover:bg-[var(--background-secondary)] transition-colors duration-100 group data-[state=active]:text-[var(--text)]"
            asChild
          >
            <Link href={`/${profile.username}/media`} className="relative z-10">
              <span>Media</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="text-[15px] text-[var(--text-secondary)] flex items-center justify-center w-full font-bold py-3 relative hover:bg-[var(--background-secondary)] transition-colors duration-100 group data-[state=active]:text-[var(--text)]"
            asChild
          >
            <Link href={`/${profile.username}/likes`} className="relative z-10">
              <span>Likes</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-data-[state=active]:bg-[var(--blue)] transition-colors duration-100"></span>
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <VideoSelector
        videos={allVideos}
        setSelectedVideo={(url, title) => setSelectedVideo({ url, title })}
        setIsPlaying={setIsPlaying}
        username={profile.username}
        profile={profile}
      />

      <SuggestedUserCard />

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md p-4 bg-[var(--background-primary)] rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-[var(--text)]">
                {dialogType === "following" ? "Following" : "Followers"}
                {dialogType === "following" && isOwner && (
                  <span className="ml-2 text-sm text-[var(--text-secondary)]">
                    ({filteredFollowing.length})
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder={`Search ${dialogType}...`}
              value={dialogType === "following" ? followingSearchQuery : followersSearchQuery}
              onChange={(e) => dialogType === "following"
                ? setFollowingSearchQuery(e.target.value)
                : setFollowersSearchQuery(e.target.value)}
              className="mb-4 w-full rounded-md border border-solid border-[var(--border)] px-3 py-2 text-[15px] text-black placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            />
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {dialogType === "following"
                ? (filteredFollowing.length > 0 ? (
                  filteredFollowing.map((user) => (
                    <div className="p-2 hover:bg-[var(--background-secondary)] rounded-md transition-colors" key={"following" + user.id}>
                      <User user={user} />
                    </div>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-[15px]">
                    {followingSearchQuery ? "No matching users found." : "No users followed yet."}
                  </p>
                ))
                : (filteredFollowers.length > 0 ? (
                  filteredFollowers.map((user) => (
                    <div className="p-2 hover:bg-[var(--background-secondary)] rounded-md transition-colors" key={"followers" + user.id}>
                      <User user={user} />
                    </div>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-[15px]">
                    {followersSearchQuery ? "No matching users found." : "No followers yet."}
                  </p>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
      <PreviewDialog open={preview.open} handlePreviewClose={handlePreviewClose} url={preview.url} />
      {token && isNewMessageOpen && (
        <NewMessageDialog
          handleNewMessageClose={() => setIsNewMessageOpen(false)}
          open={isNewMessageOpen}
          token={token}
          recipient={profile.username}
        />
      )}
      {snackbar.open && (
        <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
      )}
    </div>
  );
}