import Image from "next/image";

export default function GlobalLoading() {
    return (
        <div className="flex items-center justify-center bg-[var(--background-primary)] z-auto h-screen">
            <Image
                src="/icon.png"
                alt="Loading icon"
                width={250}
                height={250}
            />
        </div>
    );
}