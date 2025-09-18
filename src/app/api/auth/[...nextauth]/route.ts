import {facebookAuth, googleAuth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export const GET = async (request: Request) => {
    const {searchParams} = new URL(request.url);
    const provider = searchParams.get("provider");

    let authProvider;
    switch (provider) {
        case "google":
            authProvider = googleAuth;
            break;
        case "facebook":
            authProvider = facebookAuth;
            break;
        default:
            return new NextResponse("Fournisseur non supporté", {status: 400});
    }

    const [url, state] = await authProvider.getAuthorizationUrl();
    (await cookies()).set("oauth_state", state, {
        httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60
    });

    return NextResponse.redirect(url.toString());
};
