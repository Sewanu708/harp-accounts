/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Head>
        <title>Page Not Found</title>
      </Head>
      
      <div className="text-center p-8 max-w-md">
        <div className="w-64 h-64 mx-auto mb-8">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#E5E7EB" d="M40,-58.4C52.1,-49.5,62.5,-39.3,67.3,-26.6C72.1,-13.9,71.4,1.3,66.7,15.1C62,28.9,53.4,41.3,41.6,50.8C29.8,60.3,14.9,66.9,-0.5,67.6C-15.9,68.3,-31.8,63.1,-45.1,53.8C-58.4,44.5,-69.1,31.1,-72.9,15.6C-76.7,0.1,-73.6,-17.5,-64.8,-32.4C-56,-47.3,-41.5,-59.5,-26.9,-67.3C-12.3,-75.1,2.4,-78.5,16.2,-74.7C30,-70.9,43,-59.8,40,-58.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Oops! Page not found</h2>
        <p className="text-gray-600 mb-8">
          We can't seem to find the page you're looking for.
        </p>
        <Link href="/">
          <p className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Return Home
          </p>
        </Link>
      </div>
    </div>
  );
}