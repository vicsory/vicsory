import { NextResponse } from "next/server";

export async function GET() {
    const response = new NextResponse();
    response.cookies.delete("token");
    return response;
}
