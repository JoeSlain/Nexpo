import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "app/config/locales.js";

const locales = SUPPORTED_LOCALES as readonly string[];
const defaultLocale = DEFAULT_LOCALE;

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
	const acceptLanguage = request.headers.get("accept-language") ?? undefined;
	const headers = { "accept-language": acceptLanguage || "" };
	const languages = new Negotiator({ headers }).languages();
	return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
	// Check if there is any supported locale in the pathname
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) return;

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	// e.g. incoming request is /products
	// the new URL is now /en/products
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip all internal paths (_next)
		"/((?!_next|api|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
		// Optional: only run on root (/) URL
		// '/'
	],
};
