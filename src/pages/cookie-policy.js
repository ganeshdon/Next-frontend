import CookiePolicy from '@/components/auth/CookiePolicy';
import HomeLayout from '@/Layout/HomeLayout';

export default function CookiesPage() {
  return (
    <HomeLayout>
      <CookiePolicy />
    </HomeLayout>
  );
}

