'use client';

import { useState } from 'react';
import styles from './signup.module.scss';
import { useRouter } from 'next/navigation';
import { signUpWithProfile } from '@/services/authService';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // 회원가입 처리
  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      await signUpWithProfile(email, password);
      alert('회원가입 성공! 이메일을 확인하세요.');
      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>회원가입</h1>
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
