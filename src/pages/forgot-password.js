import ForgotPassword from '@/components/auth/ForgotPassword';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function ForgotPasswordPage() {
  const title = 'Forgot Password - Your Bank Statement Converter';
  const description = 'Reset your password to access your bank statement converter account.';
  
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
        <ForgotPassword />
      </HomeLayout>
    </>
  );
}

