'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './signup.module.scss'; // module.scss 사용

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 회원가입 함수
  const handleSignup = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      alert('회원가입 성공! 이메일을 확인하세요.');
      window.location.href = '/login'; // 회원가입 후 로그인 페이지로 이동
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>회원가입</h1>
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
        onClick={handleSignup}
        disabled={loading}
        className={styles.button}
      >
        {loading ? '가입 중...' : '회원가입'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
