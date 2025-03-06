import Image from "next/image";
import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <div className="error-global">
            <Image src="/assets/favicon-white.png" alt="" width={75} height={75} />
            <h1>You are not authorized to view this page.</h1>
            <Link href="/">Return to the homepage</Link>
        </div>
    );
}
