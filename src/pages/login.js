import Login from '@/components/auth/Login';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function LoginPage() {
  const title = 'Login - Your Bank Statement Converter';
  const description = 'Login to your account to convert PDF bank statements to Excel and CSV formats.';
  
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
        <Login />
      </HomeLayout>
    </>
  );
}

