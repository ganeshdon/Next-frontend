import HomeLayout from '@/Layout/HomeLayout';
import Signup from '@/components/auth/Signup';
import Head from 'next/head';

export default function SignUp() {
  const title = 'Signup - Your Bank Statement Converter';
  const description = 'Create your account to convert PDF bank statements to Excel and CSV formats. Secure, fast, and easy to use.';
  
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
        <Signup />
      </HomeLayout>
    </>
  );
}

