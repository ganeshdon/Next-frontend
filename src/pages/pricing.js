import Pricing from '@/components/auth/Pricing';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function PricingPage() {
  const title = 'Pricing - Your Bank Statement Converter';
  const description = 'Choose the perfect plan for your bank statement conversion needs. Monthly and annual plans available.';
  
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
        <Pricing />
      </HomeLayout>
    </>
  );
}

