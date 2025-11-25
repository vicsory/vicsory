import { useFormikContext } from "formik";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PersonStanding, Building, NotebookPen, Code, Paintbrush, Pen,
  ChefHat, Plane, Shirt, Vote, School, Dumbbell, Banknote, Microscope, Megaphone, Camera as CameraIcon,
  Mic, Bitcoin, Briefcase, Baby, Hammer, Joystick, BookOpen, Leaf, Car, Sun, Megaphone as MegaphoneIcon,
  Gavel, PawPrint, Sparkles, Home, PartyPopper, Gift, Laugh as LaughIcon, Rocket, Clapperboard, GraduationCap,
  Store, DraftingCompass, Dumbbell as DumbbellIcon,
  Music,
  Laugh,
  Star,
  Gamepad, Video,
} from "lucide-react";

// Comprehensive list of categories with icons (moved from EditProfile)
const categoryOptions = [
  { value: "NONE", label: "None", icon: <PersonStanding size={20} color="#9CA3AF" /> },
  { value: "MUSIC", label: "Music", icon: <Music size={20} color="#9CA3AF" /> },
  { value: "COMEDY", label: "Comedy", icon: <Laugh size={20} color="#9CA3AF" /> },
  { value: "CELEBRITY", label: "Celebrity", icon: <Star size={20} color="#9CA3AF" /> },
  { value: "GAMER", label: "Gamer", icon: <Gamepad size={20} color="#9CA3AF" /> },
  { value: "FILM", label: "Film", icon: <Video size={20} color="#9CA3AF" /> },
  { value: "INFLUENCER", label: "Influencer", icon: <Star size={20} color="#9CA3AF" /> },
  { value: "FREELANCER", label: "Freelancer", icon: <NotebookPen size={20} color="#9CA3AF" /> },
  { value: "COMPANY", label: "Company", icon: <Building size={20} color="#9CA3AF" /> },
  { value: "MEDIA", label: "Media", icon: <Video size={20} color="#9CA3AF" /> },
  { value: "TECH", label: "Tech", icon: <Code size={20} color="#9CA3AF" /> },
  { value: "SPORTS", label: "Sports", icon: <DumbbellIcon size={20} color="#9CA3AF" /> },
  { value: "ARTIST", label: "Artist", icon: <Paintbrush size={20} color="#9CA3AF" /> },
  { value: "WRITER", label: "Writer", icon: <Pen size={20} color="#9CA3AF" /> },
  { value: "FOOD", label: "Food", icon: <ChefHat size={20} color="#9CA3AF" /> },
  { value: "TRAVEL", label: "Travel", icon: <Plane size={20} color="#9CA3AF" /> },
  { value: "FASHION", label: "Fashion", icon: <Shirt size={20} color="#9CA3AF" /> },
  { value: "POLITICS", label: "Politics", icon: <Vote size={20} color="#9CA3AF" /> },
  { value: "EDUCATION", label: "Education", icon: <School size={20} color="#9CA3AF" /> },
  { value: "HEALTH", label: "Health", icon: <Dumbbell size={20} color="#9CA3AF" /> },
  { value: "INVESTOR", label: "Investor", icon: <Banknote size={20} color="#9CA3AF" /> },
  { value: "SCIENTIST", label: "Scientist", icon: <Microscope size={20} color="#9CA3AF" /> },
  { value: "ACTIVIST", label: "Activist", icon: <Megaphone size={20} color="#9CA3AF" /> },
  { value: "PHOTOGRAPHER", label: "Photographer", icon: <CameraIcon size={20} color="#9CA3AF" /> },
  { value: "PODCASTER", label: "Podcaster", icon: <Mic size={20} color="#9CA3AF" /> },
  { value: "CRYPTO", label: "Crypto", icon: <Bitcoin size={20} color="#9CA3AF" /> },
  { value: "ENTREPRENEUR", label: "Entrepreneur", icon: <Briefcase size={20} color="#9CA3AF" /> },
  { value: "PARENTING", label: "Parenting", icon: <Baby size={20} color="#9CA3AF" /> },
  { value: "DIY", label: "DIY", icon: <Hammer size={20} color="#9CA3AF" /> },
  { value: "GAMING_DEV", label: "Gaming Developer", icon: <Joystick size={20} color="#9CA3AF" /> },
  { value: "HISTORY", label: "History", icon: <BookOpen size={20} color="#9CA3AF" /> },
  { value: "NATURE", label: "Nature", icon: <Leaf size={20} color="#9CA3AF" /> },
  { value: "AUTOMOTIVE", label: "Automotive", icon: <Car size={20} color="#9CA3AF" /> },
  { value: "SPIRITUAL", label: "Spiritual", icon: <Sun size={20} color="#9CA3AF" /> },
  { value: "MARKETING", label: "Marketing", icon: <MegaphoneIcon size={20} color="#9CA3AF" /> },
  { value: "LEGAL", label: "Legal", icon: <Gavel size={20} color="#9CA3AF" /> },
  { value: "ANIMAL", label: "Animal", icon: <PawPrint size={20} color="#9CA3AF" /> },
  { value: "BEAUTY", label: "Beauty", icon: <Sparkles size={20} color="#9CA3AF" /> },
  { value: "REAL_ESTATE", label: "Real Estate", icon: <Home size={20} color="#9CA3AF" /> },
  { value: "EVENT_PLANNER", label: "Event Planner", icon: <PartyPopper size={20} color="#9CA3AF" /> },
  { value: "CHARITY", label: "Charity", icon: <Gift size={20} color="#9CA3AF" /> },
  { value: "ARCHITECTURE", label: "Architecture", icon: <DraftingCompass size={20} color="#9CA3AF" /> },
  { value: "MEMES", label: "Memes", icon: <LaughIcon size={20} color="#9CA3AF" /> },
  { value: "SPACE", label: "Space", icon: <Rocket size={20} color="#9CA3AF" /> },
  { value: "VLOGGER", label: "Vlogger", icon: <Clapperboard size={20} color="#9CA3AF" /> },
  { value: "STUDENT", label: "Student", icon: <GraduationCap size={20} color="#9CA3AF" /> },
  { value: "RETAIL", label: "Retail", icon: <Store size={20} color="#9CA3AF" /> },
  { value: "OTHER", label: "Other", icon: <PersonStanding size={20} color="#9CA3AF" /> },
];

export default function CategorySelect() {
  const formik = useFormikContext<{ category: string }>();

  return (
    <div className="space-y-1">
      <Select
        name="category"
        value={formik.values.category}
        onValueChange={(value) => formik.setFieldValue("category", value)}
      >
        <SelectTrigger className="w-full bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] hover:bg-[var(--hover)] focus:ring-[var(--blue)]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-[var(--background-primary)] border-[var(--border-color)] text-[var(--active-mode)] max-h-60 overflow-y-auto">
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
  );
}