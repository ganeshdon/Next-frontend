import Converter from '@/components/auth/Converter';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function ConverterPage() {
  const title = 'Converter - Your Bank Statement Converter';
  const description = 'Convert your PDF bank statements to Excel and CSV formats instantly.';
  
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
        <Converter />
      </HomeLayout>
    </>
  );
}

