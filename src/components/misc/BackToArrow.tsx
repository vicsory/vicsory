import Link from "next/link";

import { FaArrowLeft } from "react-icons/fa";

export default function BackToArrow({ title, url }: { title: string; url: string }) {
    return (
        <div className="gap-4 flex items-center">
            <Link className="text-[var(--text)] cursor-pointer" href={url}>
                <FaArrowLeft />
            </Link>
            <span className="text-xl text-[var(--text)]">{title}</span>
        </div>
    );
}
