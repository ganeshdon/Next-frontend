import PrivacyPolicy from '@/components/auth/PrivacyPolicy';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function PrivacyPage() {
  const title = 'Privacy Policy - Your Bank Statement Converter';
  const description = 'Learn how we protect your privacy and handle your data when using our bank statement converter.';
  
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
        <PrivacyPolicy />
      </HomeLayout>
    </>
  );
}

