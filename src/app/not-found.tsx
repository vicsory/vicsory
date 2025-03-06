"use client";

import Image from "next/image";

export default function NotFound() {
    return (
        <div className="error-global">
            <Image src="/assets/favicon-white.png" alt="" width={75} height={75} />
            <h1>Sorry, that page doesn&apos;t exist!</h1>
            <a href="/">Return to the homepage</a>
        </div>
    );
}
