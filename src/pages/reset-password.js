import ResetPassword from '@/components/auth/ResetPassword';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function ResetPasswordPage() {
  const title = 'Reset Password - Your Bank Statement Converter';
  const description = 'Set a new password for your bank statement converter account.';
  
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
        <ResetPassword />
      </HomeLayout>
    </>
  );
}

