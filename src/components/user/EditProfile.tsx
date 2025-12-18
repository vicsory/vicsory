import { useFormik } from "formik";

import { useQueryClient } from "@tanstack/react-query";
import {
    Camera, Video, PersonStanding, Building, NotebookPen, Code, Paintbrush,
    School, Banknote, Megaphone,
    Briefcase,
    Gavel, Sparkles, Home, Gift, Rocket, GraduationCap,
    Store, BadgeCheck,
    StoreIcon,
    Handshake,
    Puzzle,
    Cpu,
    Users,
    Settings,
    BanknoteIcon,
    HeartPulse,
    Factory,
} from "lucide-react";
import * as yup from "yup";
import Image from "next/image";
import "flag-icons/css/flag-icons.min.css"; // Import flag-icons CSS

import { UserProps } from "@/types/UserProps";
import { uploadFile } from "@/utilities/storage";
import { editUser } from "@/utilities/fetch";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import XIcon from "../../../public/svg/x";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitch, FaYoutube } from "react-icons/fa";
import VideoInputList from "./components/EditProfile/VideoInputList";
import VideoPreviewList from "./components/EditProfile/VideoPreviewList";
import { BadgeBlue } from "../../../public/svg/verify-badge";
import Link from "next/link";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { Textarea } from "../ui/textarea";
import { checkBlueFromServer } from "@/utilities/misc/checkBlue";

// Comprehensive list of countries with ISO codes
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

const categoryOptions = [
    { value: "None", label: "None", icon: <PersonStanding size={20} color="#9CA3AF" /> },
    { value: "Company", label: "Company", icon: <Building size={20} color="#9CA3AF" /> },
    { value: "Startup", label: "Startup", icon: <Rocket size={20} color="#9CA3AF" /> },
    { value: "Entrepreneur", label: "Entrepreneur", icon: <Briefcase size={20} color="#9CA3AF" /> },
    { value: "SmallBusiness", label: "Small Business", icon: <StoreIcon size={20} color="#9CA3AF" /> },
    { value: "Freelancer", label: "Freelancer", icon: <NotebookPen size={20} color="#9CA3AF" /> },
    { value: "Creator", label: "Creator", icon: <Sparkles size={20} color="#9CA3AF" /> },
    { value: "Professional", label: "Professional", icon: <PersonStanding size={20} color="#9CA3AF" /> },
    { value: "Student", label: "Student", icon: <GraduationCap size={20} color="#9CA3AF" /> },
    { value: "Investor", label: "Investor", icon: <Banknote size={20} color="#9CA3AF" /> },
    { value: "Marketing", label: "Marketing", icon: <Megaphone size={20} color="#9CA3AF" /> },
    { value: "Sales", label: "Sales", icon: <Handshake size={20} color="#9CA3AF" /> },
    { value: "Engineering", label: "Engineering", icon: <Code size={20} color="#9CA3AF" /> },
    { value: "Product", label: "Product", icon: <Puzzle size={20} color="#9CA3AF" /> },
    { value: "Design", label: "Design", icon: <Paintbrush size={20} color="#9CA3AF" /> },
    { value: "Technology", label: "Technology", icon: <Cpu size={20} color="#9CA3AF" /> },
    { value: "Media", label: "Media", icon: <Video size={20} color="#9CA3AF" /> },
    { value: "Education", label: "Education", icon: <School size={20} color="#9CA3AF" /> },
    { value: "Consulting", label: "Consulting", icon: <Megaphone size={20} color="#9CA3AF" /> },
    { value: "NonProfit", label: "Non-Profit", icon: <Gift size={20} color="#9CA3AF" /> },
    { value: "Government", label: "Government", icon: <Gavel size={20} color="#9CA3AF" /> },
    { value: "HumanResources", label: "Human Resources", icon: <Users size={20} color="#9CA3AF" /> },
    { value: "Operations", label: "Operations", icon: <Settings size={20} color="#9CA3AF" /> },
    { value: "Finance", label: "Finance", icon: <BanknoteIcon size={20} color="#9CA3AF" /> },
    { value: "Legal", label: "Legal", icon: <Gavel size={20} color="#9CA3AF" /> },
    { value: "Healthcare", label: "Healthcare", icon: <HeartPulse size={20} color="#9CA3AF" /> },
    { value: "RealEstate", label: "Real Estate", icon: <Home size={20} color="#9CA3AF" /> },
    { value: "Manufacturing", label: "Manufacturing", icon: <Factory size={20} color="#9CA3AF" /> },
    { value: "Retail", label: "Retail", icon: <Store size={20} color="#9CA3AF" /> },
    { value: "Other", label: "Other", icon: <PersonStanding size={20} color="#9CA3AF" /> },
];


interface ExtendedUserProps extends UserProps {
    youtubePlayerUrls?: { url: string; title: string }[];
}

export default function EditProfile({ profile, refreshToken }: { profile: ExtendedUserProps; refreshToken: () => void }) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [headerPreview, setHeaderPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [headerFile, setHeaderFile] = useState<File | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });
    const [isBlueOpen, setIsBlueOpen] = useState(false);
    const [blueInput, setBlueInput] = useState("");
    const [isBlueLoading, setIsBlueLoading] = useState(false);

    const headerUploadInputRef = useRef<HTMLInputElement>(null);
    const photoUploadInputRef = useRef<HTMLInputElement>(null);

    const socialMediaBaseUrls = {
        tiktok: "https://tiktok.com/",
        youtube: "https://youtube.com/",
        facebook: "https://facebook.com/",
        x: "https://x.com/",
        instagram: "https://instagram.com/",
        twitch: "https://twitch.tv/",
        bluesky: "https://bsky.app/",
    };

    const queryClient = useQueryClient();

    const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setHeaderPreview(URL.createObjectURL(file));
            setHeaderFile(file);
        }
    };

    const handleHeaderClick = () => headerUploadInputRef.current?.click();

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
            setPhotoFile(file);
        }
    };

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePhotoClick = () => photoUploadInputRef.current?.click();

    const validationSchema = yup.object({
        name: yup.string().max(50, "Name should be of maximum 50 characters length.").required("Name is required"),
        description: yup.string().max(160, "Description should be of maximum 160 characters length."),
        location: yup.string().max(30, "Location should be of maximum 30 characters length."),
        website: yup.string().max(100, "Website should be of maximum 100 characters length."),
        photoUrl: yup.string(),
        headerUrl: yup.string(),
        category: yup.string().oneOf(categoryOptions.map(opt => opt.value)).required("Category is required"),
        whatsapp: yup.string()
            .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
            .max(15, "WhatsApp number should be maximum 15 characters"),
        tiktok: yup.string().max(50, "TikTok username should be maximum 50 characters"),
        youtube: yup.string().max(50, "YouTube username should be maximum 50 characters"),
        facebook: yup.string().max(50, "Facebook username should be maximum 50 characters"),
        x: yup.string().max(50, "X username should be maximum 50 characters"),
        instagram: yup.string().max(50, "Instagram username should be maximum 50 characters"),
        twitch: yup.string().max(50, "Twitch username should be maximum 50 characters"),
        bluesky: yup.string().max(50, "Bluesky username should be maximum 50 characters"),
        youtubePlayerUrls: yup.array()
            .of(
                yup.object({
                    url: yup.string()
                        .max(100, "YouTube URL should be maximum 100 characters")
                        .matches(
                            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                            "Please enter a valid YouTube URL"
                        )
                        .required("YouTube URL is required"),
                    title: yup.string()
                        .max(100, "Title should be maximum 100 characters")
                        .required("Title is required"),
                })
            )
            .max(5, "Maximum 5 videos allowed")
            .optional(),
    });

    const formik = useFormik({
        initialValues: {
            name: profile.name ?? "",
            description: profile.description ?? "",
            location: profile.location ?? "",
            website: profile.website ?? "",
            whatsapp: profile.whatsapp ?? "",
            headerUrl: profile.headerUrl ?? "",
            photoUrl: profile.photoUrl ?? "",
            category: profile.category ?? "None",
            tiktok: profile.tiktok ?? "",
            youtube: profile.youtube ?? "",
            facebook: profile.facebook ?? "",
            x: profile.x ?? "",
            instagram: profile.instagram ?? "",
            twitch: profile.twitch ?? "",
            bluesky: profile.bluesky ?? "",
            youtubePlayerUrls: profile.youtubePlayerUrls ?? (profile.youtubePlayerUrl ? [{ url: profile.youtubePlayerUrl, title: profile.youtubePlayerTitle ?? "" }] : []),
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const updatedValues = { ...values };
                if (headerFile) {
                    const headerPath = await uploadFile(headerFile);
                    if (!headerPath) throw new Error("Header upload failed.");
                    updatedValues.headerUrl = headerPath;
                }
                if (photoFile) {
                    const photoPath = await uploadFile(photoFile);
                    if (!photoPath) throw new Error("Photo upload failed.");
                    updatedValues.photoUrl = photoPath;
                }

                console.log("Sending updatedValues:", updatedValues);
                const response = await editUser(JSON.stringify(updatedValues), profile.username);
                console.log("EditUser response:", response);
                if (!response || !response.success) {
                    console.log("Full error details:", response?.error);
                    throw new Error(response?.message || "Server returned unsuccessful response");
                }

                setSnackbar({
                    message: "Your profile has been updated successfully.",
                    severity: "success",
                    open: true,
                });

                refreshToken();
                queryClient.invalidateQueries({ queryKey: ["users", profile.username] });
            } catch (error) {
                setSnackbar({
                    message: error instanceof Error ? error.message : "Something went wrong while updating profile.",
                    severity: "error",
                    open: true,
                });
            }
        },
    });

    const handleBlueSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (blueInput === "") return;
        setIsBlueLoading(true);
        try {
            const checkResponse = await checkBlueFromServer(blueInput);
            if (!checkResponse) throw new Error("Invalid blue code.");
            const response = await editUser(JSON.stringify({ isPremium: true }), profile.username);
            if (!response.success) throw new Error("Server error while updating blue status.");
            setSnackbar({
                message: "You got your blue successfully. Congrats!",
                severity: "success",
                open: true,
            });
            setIsBlueOpen(false);
            refreshToken();
            queryClient.invalidateQueries({ queryKey: ["users", profile.username] });
        } catch (error) {
            setSnackbar({
                message: error instanceof Error ? error.message : "Something went wrong while getting your blue.",
                severity: "error",
                open: true,
            });
        } finally {
            setIsBlueLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="relative h-52 bg-[var(--background-secondary)]">
                <Image
                    alt="Header"
                    src={
                        headerPreview
                            ? headerPreview
                            : profile.headerUrl
                                ? getFullURL(profile.headerUrl)
                                : "/assets/header.jpg"
                    }
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                        variant="outline"
                        className="absolute inset-0 m-auto w-12 h-12 bg-[var(--background-primary)] hover:bg-[var(--background-secondary)] border border-solid border-[var(--border)] rounded-full"
                        onClick={handleHeaderClick}
                    >
                        <Camera size={20} className="text-[var(--text)]" />
                    </Button>
                    <input
                        ref={headerUploadInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleHeaderChange}
                        accept="image/*"
                    />
                </div>


                {/* Avatar */}
                <div className="absolute -bottom-16 left-6">
                    <Avatar className="w-32 h-32 border-4 border-solid border-[var(--border)] relative">
                        <AvatarImage
                            src={
                                photoPreview
                                    ? photoPreview
                                    : profile.photoUrl
                                        ? getFullURL(profile.photoUrl)
                                        : "/assets/egg.jpg"
                            }
                            alt="Profile"
                        />
                        <Button
                            variant="outline"
                            className="absolute inset-0 m-auto w-12 h-12 bg-[var(--background-primary)] hover:bg-[var(--background-secondary)] border border-solid border-[var(--border)] rounded-full"
                            onClick={handlePhotoClick}
                        >
                            <Camera size={20} className="text-[var(--text)]" />
                        </Button>
                        <input
                            ref={photoUploadInputRef}
                            type="file"
                            className="hidden"
                            onChange={handlePhotoChange}
                            accept="image/*"
                        />
                    </Avatar>
                </div>
            </div>

            {/* Form Section */}
            <div className="mt-20 px-4 pb-6 bg-[var(--background-primary)]">
                <div className="flex justify-between items-center mb-6 pt-6">
                    <h1 className="text-2xl font-bold text-[var(--text)]">Edit Profile</h1>
                    <Button
                        variant="ghost"
                        className="text-base text-[var(--blue)] hover:text-[var(--blue-secondary)]"
                        onClick={() => setIsBlueOpen(true)}
                    >
                        <BadgeBlue />Get verified now!
                    </Button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <div className="relative">
                            <Input
                                name="name"
                                placeholder="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.name && formik.errors.name ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                {categoryOptions.find(opt => opt.value === formik.values.category)?.icon}
                            </span>
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Textarea
                            name="description"
                            placeholder="Bio"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 min-h-[100px] ${formik.touched.description && formik.errors.description ? "border-[var(--red)]" : ""
                                }`}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="relative">
                                <Select
                                    name="location"
                                    value={formik.values.location}
                                    onValueChange={(value) => formik.setFieldValue("location", value)}
                                >
                                    <SelectTrigger className="w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:ring-[var(--blue)]">
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] max-h-60 overflow-y-auto">
                                        {countryOptions.map((country) => (
                                            <SelectItem key={country.value} value={country.value}>
                                                <span className="flex items-center gap-2">
                                                    <span className={`fi fi-${country.code} w-5 h-5 rounded-full`}></span>
                                                    {country.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formik.values.location && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <span className={`fi fi-${countryOptions.find(c => c.value === formik.values.location)?.code} w-5 h-5 rounded-full`}></span>
                                    </span>
                                )}
                            </div>
                            {formik.touched.location && formik.errors.location && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.location}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Input
                                name="website"
                                placeholder="Website"
                                value={formik.values.website}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.website && formik.errors.website ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            {formik.touched.website && formik.errors.website && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.website}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* TikTok */}
                        <div className="space-y-1">
                            <label htmlFor="tiktok" className="flex items-center space-x-2">
                                <FaTiktok size={20} color="var(--text)" />
                                <span className="text-sm text-gray-500" title={socialMediaBaseUrls.tiktok}>
                                    {socialMediaBaseUrls.tiktok}
                                </span>
                            </label>
                            <Input
                                name="tiktok"
                                placeholder="TikTok Username"
                                value={formik.values.tiktok}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.tiktok && formik.errors.tiktok ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            {formik.touched.tiktok && formik.errors.tiktok && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.tiktok}</p>
                            )}
                        </div>

                        {/* YouTube (Social Link) */}
                        <div className="space-y-1">
                            <label htmlFor="youtube" className="flex items-center space-x-2">
                                <FaYoutube size={20} color="var(--text)" />
                                <span className="text-sm text-gray-500" title={socialMediaBaseUrls.youtube}>
                                    {socialMediaBaseUrls.youtube}
                                </span>
                            </label>
                            <Input
                                name="youtube"
                                placeholder="YouTube Username"
                                value={formik.values.youtube}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.youtube && formik.errors.youtube ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            {formik.touched.youtube && formik.errors.youtube && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.youtube}</p>
                            )}
                        </div>

                        {/* Facebook */}
                        <div className="space-y-1">
                            <label htmlFor="facebook" className="flex items-center space-x-2">
                                <FaFacebook size={20} color="var(--text)" />
                                <span className="text-sm text-gray-500" title={socialMediaBaseUrls.facebook}>
                                    {socialMediaBaseUrls.facebook}
                                </span>
                            </label>
                            <Input
                                name="facebook"
                                placeholder="Facebook Username"
                                value={formik.values.facebook}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.facebook && formik.errors.facebook ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            {formik.touched.facebook && formik.errors.facebook && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.facebook}</p>
                            )}
                        </div>

                        {/* X */}
                        <div className="space-y-1">
                            <label htmlFor="x" className="flex items-center space-x-2">
                                <XIcon size={20} color="var(--text)" />
                                <span className="text-sm text-gray-500" title={socialMediaBaseUrls.x}>
                                    {socialMediaBaseUrls.x}
                                </span>
                            </label>
                            <Input
                                name="x"
                                placeholder="X Username"
                                value={formik.values.x}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.x && formik.errors.x ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            {formik.touched.x && formik.errors.x && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.x}</p>
                            )}
                        </div>

                        {/* Instagram */}
                        <div className="space-y-1">
                            <label htmlFor="instagram" className="flex items-center space-x-2">
                                <FaInstagram size={20} color="var(--text)" />
                                <span className="text-sm text-gray-500" title={socialMediaBaseUrls.instagram}>
                                    {socialMediaBaseUrls.instagram}
                                </span>
                            </label>
                            <Input
                                name="instagram"
                                placeholder="Instagram Username"
                                value={formik.values.instagram}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.instagram && formik.errors.instagram ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            {formik.touched.instagram && formik.errors.instagram && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.instagram}</p>
                            )}
                        </div>

                        {/* Twitch */}
                        <div className="space-y-1">
                            <label htmlFor="twitch" className="flex items-center space-x-2">
                                <FaTwitch size={20} color="var(--text)" />
                                <span className="text-sm text-gray-500" title={socialMediaBaseUrls.twitch}>
                                    {socialMediaBaseUrls.twitch}
                                </span>
                            </label>
                            <Input
                                name="twitch"
                                placeholder="Twitch Username"
                                value={formik.values.twitch}
                                onChange={formik.handleChange}
                                className={`w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:outline-none focus:border-[var(--blue)] focus:border-2 ${formik.touched.twitch && formik.errors.twitch ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            {formik.touched.twitch && formik.errors.twitch && (
                                <p className="text-[var(--red)] text-sm">{formik.errors.twitch}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <Input
                                name="whatsapp"
                                placeholder="WhatsApp Number (e.g., +1234567890)"
                                value={formik.values.whatsapp}
                                onChange={formik.handleChange}
                                className={`w-full bg-green-50 border-green-500 text-green-900 hover:bg-green-100 focus:outline-none focus:border-green-600 focus:border-2 pl-10 ${formik.touched.whatsapp && formik.errors.whatsapp ? "border-[var(--red)]" : ""
                                    }`}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                    alt="WhatsApp"
                                    width={20}
                                    height={20}
                                />
                            </span>
                        </div>
                        {formik.touched.whatsapp && formik.errors.whatsapp && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.whatsapp}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Select
                            name="category"
                            value={formik.values.category}
                            onValueChange={(value) => formik.setFieldValue("category", value)}
                        >
                            <SelectTrigger className="w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:ring-[var(--blue)]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] max-h-60 overflow-y-auto">
                                {categoryOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                                        <span className="flex items-center gap-2">
                                            {option.icon}
                                            {option.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formik.touched.category && formik.errors.category && (
                            <p className="text-[var(--red)] text-sm">{formik.errors.category}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--text)]">Profile Videos</h3>
                        <VideoInputList
                            videos={formik.values.youtubePlayerUrls ?? []}
                            setFieldValue={formik.setFieldValue}
                            errors={formik.errors.youtubePlayerUrls as any} // Refine type if needed
                            touched={formik.touched.youtubePlayerUrls as any} isPremium={false} />
                        <VideoPreviewList
                            videos={formik.values.youtubePlayerUrls ?? []}
                            setPreviewUrl={setPreviewUrl}
                            setIsPlaying={setIsPlaying}
                        />
                        {previewUrl && isPlaying && (
                            <div className="mt-4">
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={previewUrl}
                                    title="Video preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!formik.isValid || !formik.dirty}
                        className={`w-full bg-[var(--blue)] text-white hover:bg-[var(--blue-secondary)] disabled:bg-[var(--grey)] disabled:text-gray-500 disabled:cursor-not-allowed`}
                    >
                        {formik.isSubmitting ? <p className="text-sm">loading...</p> : "Save Changes"}
                    </Button>
                </form>
            </div>

            {/* Snackbar */}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}

            {/* Blue Modal */}
            {isBlueOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-[var(--background-primary)] rounded-xl p-6 max-w-md w-full border border-[var(--border)] shadow-xl">
                        {profile.isPremium ? (
                            <div className="text-center space-y-4">
                                <Image src="/assets/favicon.png" alt="Logo" width={75} height={75} className="mx-auto" />
                                <p className="text-[var(--text)]">{"You're Already Blue!"}</p>
                                <p className="text-[var(--text)]">Thank you for being a premium member.</p>
                                <Button
                                    variant="outline"
                                    className="w-full border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)]"
                                    onClick={() => setIsBlueOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
                                    Get Vicsory Blue <BadgeBlue />
                                </h2>
                                <p className="text-[var(--text)]">
                                    Unlock the blue bird next to your name with Vicsory Blue subscription!
                                </p>
                                <p className="text-[var(--text)]">
                                    Find the code on{" "}
                                    <Link
                                        href="https://x.com/VicsoryApp"
                                        target="_blank"
                                        className="text-[var(--blue)] hover:text-[var(--blue-secondary)]"
                                    >
                                        x.com
                                    </Link>
                                </p>
                                <form onSubmit={handleBlueSubmit} className="space-y-4">
                                    <Input
                                        type="text"
                                        value={blueInput}
                                        onChange={(e) => setBlueInput(e.target.value)}
                                        placeholder="Enter your code"
                                        className="w-full bg-[var(--background-primary)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--background-secondary)] focus:ring-[var(--blue)]"
                                        autoFocus
                                    />
                                    <div className="flex items-center justify-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="border-[var(--border)] text-[var(--text)] hover:text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"
                                            onClick={() => setIsBlueOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex items-center justify-center bg-[var(--blue)] text-white hover:bg-[var(--blue-secondary)] disabled:bg-[var(--grey)]"
                                            disabled={isBlueLoading}
                                        >
                                            {isBlueLoading ? <p className="text-sm">loading...</p> : "Submit"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}