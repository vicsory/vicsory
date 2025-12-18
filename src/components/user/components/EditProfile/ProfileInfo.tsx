// "use client";

// import { categoryIcons } from "./constants";
// import { 
//   Tooltip, 
//   TooltipContent, 
//   TooltipProvider, 
//   TooltipTrigger 
// } from "@/components/ui/tooltip";
// import { BadgeCheck } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Avatar, 
//   AvatarFallback, 
//   AvatarImage 
// } from "@/components/ui/avatar";
// import { BadgeBlue, BadgeGold, BadgeRed } from "../../../../../public/svg/verify-badge";
// import { getFullURL } from "@/utilities/misc/getFullURL";
// import { UserProps } from "@/types/UserProps";

// interface ProfileInfoProps extends UserProps {
//   handleImageClick: (e: React.MouseEvent<HTMLImageElement>) => void;
// }

// export default function ProfileInfo({ profile, handleImageClick }: ProfileInfoProps) {
//   const formatCategory = (category: string): string | null => {
//     if (!category || category === "NONE") return null;
//     return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
//   };

//   const displayName = profile.username.trim() || profile.username;
//   const categoryFormatted = formatCategory(profile.category || "");

//   return (
//     <div className="relative px-4 pt-16 pb-4">
//       {/* Profile Photo */}
//       <div className="absolute top-0 left-4 -translate-y-1/2 transition-transform hover:scale-105">
//         <div className="cursor-pointer border border-solid border-[var(--border-color)] rounded-full p-1 bg-[var(--background-primary)] shadow-md">
//           <Avatar className="w-20 h-20 border border-solid border-[var(--border-color)]">
//             <AvatarImage
//               onClick={handleImageClick}
//               src={profile.photoUrl ? getFullURL(profile.photoUrl) : "/assets/egg.jpg"}
//               alt={`${profile.username}'s profile photo`}
//               className="object-cover"
//               loading="lazy"
//             />
//             <AvatarFallback className="text-xl font-bold">
//               {profile.username.charAt(0).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//         </div>
//       </div>

//       {/* Profile Name and Username */}
//       <div className="flex flex-col gap-1">
//         <h1 className="flex items-center gap-2 text-[20px] font-extrabold">
//           <span className="truncate max-w-[70%]">{displayName}</span>
//           {profile.category && categoryFormatted && (
//             <span aria-hidden="true">
//               {categoryIcons[profile.category as keyof typeof categoryIcons]}
//             </span>
//           )}
//           {profile.isPremium && (
//             <span 
//               data-blue="Verified Blue" 
//               aria-label="Verified account"
//               title="Verified account"
//             >
//               <BadgeBlue/>
//             </span>
//           )}
//           {profile.isVip && (
//             <span 
//               data-gold="Verified Gold" 
//               aria-label="Verified account"
//               title="Verified account"
//             >
//               <BadgeGold/>
//             </span>
//           )}
//           {profile.isElite && (
//             <span 
//               data-red="Verified Red" 
//               aria-label="Verified account"
//               title="Verified account"
//             >
//               <BadgeRed />
//             </span>
//           )}
//         </h1>
//         <div className="text-[var(--text-secondary)] flex items-center flex-wrap gap-2">
//           <span>@{profile.username}</span>
//           {categoryFormatted && (
//             <TooltipProvider delayDuration={200}>
//               <Tooltip>
//                 <TooltipTrigger>
//                   <Badge
//                     variant="secondary"
//                     className="rounded-full border border-solid border-[var(--border-color)] hover:border-[var(--border-color)] bg-[var(--hover)] text-[var(--text-secondary)] hover:bg-transparent hover:text-[var(--text-secondary)] text-[13px] font-normal transition-colors"
//                   >
//                     {categoryFormatted}
//                   </Badge>
//                 </TooltipTrigger>
//                 <TooltipContent className="p-2 bg-[var(--background-primary)] rounded-lg shadow-lg max-w-[200px]">
//                   <p>This user is a {categoryFormatted} enthusiast</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           )}
//         </div>
//       </div>

//       {/* Profile Description */}
//       {profile.description && (
//         <div className="text-[15px] leading-5 break-words mt-2">
//           {profile.description}
//         </div>
//       )}
//     </div>
//   );
// }