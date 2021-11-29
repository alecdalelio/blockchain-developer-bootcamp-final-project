/* pages/_app.js */
import "../styles/globals.css";
import Link from "next/link";

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <div>
        <nav className="border-b p-6 bg-red-100">
          <p className="text-4xl font-bold"> 📷 Photo NFT Marketplace</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-4 text-red-500">Home</a>
            </Link>
            <Link href="/create-nft">
              <a className="mr-6 text-red-500">Create Photo NFT</a>
            </Link>
            <Link href="/my-assets">
              <a className="mr-6 text-red-500">Photos Purchased</a>
            </Link>
            <Link href="/creator-dashboard">
              <a className="mr-6 text-red-500">Photos Created</a>
            </Link>
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default MyApp;
