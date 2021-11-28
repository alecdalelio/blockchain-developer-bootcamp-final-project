/* pages/_app.js */
import "../styles/globals.css";
import Link from "next/link";

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <div>
        <nav className="border-b p-6">
          <p className="text-4xl font-bold">Photo NFT Marketplace</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-4 text-pink-500">Home</a>
            </Link>
            <Link href="/create-nft">
              <a className="mr-6 text-pink-500">Sell Your Photos as NFTs</a>
            </Link>
            <Link href="/my-assets">
              <a className="mr-6 text-pink-500">My Photos</a>
            </Link>
            <Link href="/creator-dashboard">
              <a className="mr-6 text-pink-500">Creator Dashboard</a>
            </Link>
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default MyApp;
