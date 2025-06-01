import Head from 'next/head';
import React from 'react';

export function PWAHead() {
  return (
    <Head>
      <meta name="application-name" content="EdPsych Connect" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="EdPsych" />
      <meta name="description" content="Educational psychology resources and tools" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#4f46e5" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#4f46e5" />

      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#4f46e5" />
      <link rel="shortcut icon" href="/favicon.ico" />
            
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://edpsychconnect.com" />
      <meta name="twitter:title" content="EdPsych Connect" />
      <meta name="twitter:description" content="Educational psychology resources and tools" />
      <meta name="twitter:image" content="https://edpsychconnect.com/icons/android-chrome-192x192.png" />
      <meta name="twitter:creator" content="@edpsychconnect" />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content="EdPsych Connect" />
      <meta property="og:description" content="Educational psychology resources and tools" />
      <meta property="og:site_name" content="EdPsych Connect" />
      <meta property="og:url" content="https://edpsychconnect.com" />
      <meta property="og:image" content="https://edpsychconnect.com/icons/apple-touch-icon.png" />
    </Head>
  );
}
