import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");

    if (!provider) {
        return new NextResponse("Fournisseur non supporté", { status: 400 });
    }

    // Redirect to the canonical OAuth initiation endpoint
    const redirectUrl = new URL(`/api/auth?provider=${encodeURIComponent(provider)}`, request.url);
    return NextResponse.redirect(redirectUrl.toString());
};
