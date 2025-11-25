import Blog from '@/components/auth/Blog';
import Head from 'next/head';

export default function BlogPage() {
  const title = 'Blog - Your Bank Statement Converter';
  const description = 'Read articles and guides about bank statement conversion, financial data management, and more.';
  
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
      <Blog />
    </>
  );
}

