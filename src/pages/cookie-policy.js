import CookiePolicy from '@/components/auth/CookiePolicy';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function CookiesPage() {
  const title = 'Cookie Policy - Your Bank Statement Converter';
  const description = 'Learn about how we use cookies on our bank statement converter website.';
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <HomeLayout>
        <CookiePolicy />
      </HomeLayout>
    </>
  );
}

