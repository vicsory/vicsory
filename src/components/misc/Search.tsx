import { useState } from "react";
import { useRouter } from "next/navigation";

import { BsSearch } from "react-icons/bs";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const encodedSearchQuery = encodeURI(searchQuery);
        router.push(`/search?q=${encodedSearchQuery}`);
    };

    return (
        <div className="hidden md:block w-full max-w-md mx-" onSubmit={onSearch}>
            <form className="relative flex items-center">
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Vicsory"
                    required
                    className="
              w-full py-2 px-4 rounded-full 
              bg-[var(--hover)] 
              text-[var(--text-secondary)]
              border border-[var(--border)]
              focus:outline-none
              focus:border-[var(--blue)] 
              focus:border-2
              placeholder-[var(--text-secondary)]
              hover:bg-[var(--background-secondary)]
              transition-colors
            "
                />
                <button
                    type="submit"
                    className="absolute right-3 text-[var(--text)] hover:text-[var(--blue)]"
                >
                    <BsSearch className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
}
