import TermsConditions from '@/components/auth/TermsConditions';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function TermsPage() {
  const title = 'Terms & Conditions - Your Bank Statement Converter';
  const description = 'Read our terms and conditions for using the bank statement converter service.';
  
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
        <TermsConditions />
      </HomeLayout>
    </>
  );
}

