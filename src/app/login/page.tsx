'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './login.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // ✅ 로그인 후 쿠키에 인증 정보 반영
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      // ✅ 쿠키에 반영된 세션을 즉시 가져와서 확인
      console.log(
        '✅ 쿠키에 저장된 세션 확인:',
        await supabase.auth.getSession()
      );
    }

    // ✅ 대시보드로 이동
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <h1>로그인</h1>
      <input
        type='email'
        placeholder='이메일'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type='password'
        placeholder='비밀번호'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className={styles.button}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
