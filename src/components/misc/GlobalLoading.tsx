import Image from "next/image";

export default function GlobalLoading() {
    return (
        <div className="flex items-center justify-center bg-[var(--background-primary)] z-auto h-screen">
            <Image
                src="/icon.png" // Path relative to the 'public' folder
                alt="Loading icon"
                width={250} // Specify the width of the icon in pixels
                height={250} // Specify the height of the icon in pixels
            />
        </div>
    );
}