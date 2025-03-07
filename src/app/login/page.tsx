'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './login.module.scss'; // module.scss 사용

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 로그인 함수
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert('로그인 성공!');
      window.location.href = '/dashboard'; // 로그인 후 이동할 페이지
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>로그인</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="비밀번호"
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
