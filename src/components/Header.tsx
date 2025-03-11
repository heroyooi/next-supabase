'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './header.module.scss';

export default function Header() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href='/' className={styles.logo}>
          Next+Supabase
        </Link>
        <nav className={styles.nav}>
          <Link href='/' className={styles.navItem}>
            홈
          </Link>
          {user ? (
            <>
              <Link href='/dashboard' className={styles.navItem}>
                대시보드
              </Link>
              <button onClick={handleLogout} className={styles.navItem}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href='/signup' className={styles.navItem}>
                회원가입
              </Link>
              <Link href='/login' className={styles.navItem}>
                로그인
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
