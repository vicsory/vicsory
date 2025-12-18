// "use client";

// import { ProfileProps, UserProps } from "@/types/UserProps";
// import { getFullURL } from "@/utilities/fetch/misc/getFullURL";
// import { Avatar, AvatarFallback, AvatarImage, Plus } from "./imports";

// export default function FollowSection({ profile, handleDialogOpen }: ProfileProps & { handleDialogOpen: (type: "followers" | "following") => void }) {
//   const firstThreeFollowings = profile.following.filter((user): user is UserProps => typeof user !== "string").slice(0, 3);

//   return (
//     <div className="flex items-center gap-4 text-[14px] px-4 py-2 border-t border-solid border-[var(--border-color)]">
//       <div onClick={() => handleDialogOpen("followers")} className="cursor-pointer hover:underline">
//         <span className="font-semibold">{profile.followers.length}</span>{" "}
//         <span className="text-[var(--text-secondary)]">Followers</span>
//       </div>
//       <div onClick={() => handleDialogOpen("following")} className="cursor-pointer hover:underline flex items-center gap-2">
//         <div className="flex -space-x-2 items-center">
//           {firstThreeFollowings.map((user) => (
//             <Avatar key={typeof user === "string" ? user : user.id} className="w-7 h-7 border border-solid border-[var(--border-color)]">
//               <AvatarImage
//                 src={typeof user !== "string" && user.photoUrl ? getFullURL(user.photoUrl) : "/assets/egg.jpg"}
//                 alt={typeof user === "string" ? user : user.username}
//               />
//               <AvatarFallback>{typeof user === "string" ? (user as string).charAt(0) : user.username.charAt(0)}</AvatarFallback>
//             </Avatar>
//           ))}
//           {profile.following.length > 3 && (
//             <div className="flex items-center justify-center w-7 h-7 bg-[var(--hover)] rounded-full border border-solid border-[var(--border-color)]">
//               <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
//             </div>
//           )}
//         </div>
//         <span className="font-semibold">{profile.following.length}</span>{" "}
//         <span className="text-[var(--text-secondary)]">Following</span>
//       </div>
//     </div>
//   );
// }