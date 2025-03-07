'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <div>
      {user ? (
        <>
          <h1>환영합니다, {user.email}!</h1>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
}
