import Link from "next/link";
import React from "react";
import Image from "next/image";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import { getAuth } from "@/lib/better-auth/auth";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const requestHeaders = await headers();
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (session?.user) redirect('/')
    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo flex items-center gap-2">
                    <Image src="/assets/images/logo.png" alt="Portfolio Viewer" width={200} height={50}/>
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">
                    {children}
                </div>
            </section>
            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <h2 className="text-3xl font-semibold text-white mb-4">Portfolio Viewer</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Sign in to access your watchlist, stock alerts, and market overview from one place.
                    </p>
                </div>
                <div className="flex-1 relative">
                    <Image src="/assets/images/dashboard.png" alt="Dashboard Preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
                </div>
            </section>

        </main>
    )
}
export default Layout
