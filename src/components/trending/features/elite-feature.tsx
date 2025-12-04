// "use client";

// import React from "react";
// import { UserProps } from "@/types/UserProps";
// import EliteUsers from "@/components/user/elite-users";

// interface EliteUsersScrollerProps {
//   users: UserProps[];
//   title?: string;
// }

// export default function EliteUsersScroller({
//   users,
//   title = "Elite Members",
// }: EliteUsersScrollerProps) {
//   const eliteUsers = users?.filter((u): u is UserProps => !!u && u.isElite === true) || [];

//   if (eliteUsers.length === 0) return null;

//   return (
//     <section className="w-full mx-auto">
//       <div className="flex items-center gap-3 px-4 py-2">
//         <h3 className="font-semibold text-[var(--active-mode)]">{title}</h3>
//       </div>

//       <div className="w-full px-4 overflow-x-auto scrollbar-hide">
//         <div className="flex gap-6 pb-2">
//           {eliteUsers.map((user, i) => (
//             <div key={`elite-${i}`} className="flex-shrink-0 w-[300px]">
//               <EliteUsers user={user} />
//             </div>
//           ))}
//         </div>
//       </div>

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

