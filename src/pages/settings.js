import Settings from '@/components/auth/Settings';
import HomeLayout from '@/Layout/HomeLayout';
import Head from 'next/head';

export default function SettingsPage() {
  const title = 'Settings - Your Bank Statement Converter';
  const description = 'Manage your account settings and preferences.';
  
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
        <Settings />
      </HomeLayout>
    </>
  );
}

