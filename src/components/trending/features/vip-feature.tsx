// "use client";

// import React from "react";
// import { UserProps } from "@/types/UserProps";
// import VipUsers from "@/components/user/vip-users";

// interface VipUsersScrollerProps {
//   users: UserProps[];
//   title?: string;
// }

// export default function VipUsersScroller({
//   users,
//   title = "Vip Members",
// }: VipUsersScrollerProps) {
//   const vipUsers = users.filter((u) => u.isVip);

//   if (vipUsers.length === 0) return null;

//   return (
//     <section className="w-full mx-auto">
//       {/* Title */}
//       <div className="flex items-center gap-3 px-4 py-2">
//         <h3 className="font-semibold text-[var(--active-mode)]">{title}</h3>
//       </div>

//       {/* Horizontal Scroll */}
//       <div className="w-full px-4 overflow-x-auto scrollbar-hide">
//         <div className="flex gap-6 pb-2">
//           {vipUsers.map((user, i) => (
//             <div
//               key={`elite-${i}`}
//               className="flex-shrink-0 w-[260px]"
//             >
//               <VipUsers user={user} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Hide scrollbar */}
//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </section>
//   );
// }
