import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-3">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <Image
                                src="/assets/images/logo.png"
                                alt="Portfolio Viewer"
                                width={150}
                                height={38}
                                className="brightness-0 invert"
                            />
                        </Link>
                        <p className="text-sm text-gray-400 max-w-md">
                            Portfolio Viewer helps you track stocks, monitor watchlists, and review market activity from one dashboard.
                        </p>
                    </div>

                    <nav className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
                        <Link href="/help" className="hover:text-white transition-colors">Help</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/api-docs" className="hover:text-white transition-colors">API Docs</Link>
                    </nav>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-500">
                    © {new Date().getFullYear()} Portfolio Viewer
                </div>
            </div>
        </footer>
    );
};

export default Footer;
