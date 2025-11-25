import Documents from '@/components/auth/Documents';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function DocumentsPage() {
  const title = 'Documents - Your Bank Statement Converter';
  const description = 'View and manage your converted bank statement documents.';
  
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
        <Documents />
      </HomeLayout>
    </>
  );
}

