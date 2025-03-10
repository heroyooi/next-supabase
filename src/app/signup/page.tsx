'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './signup.module.scss';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // 회원가입 함수
  const handleSignup = async () => {
    setLoading(true);
    setError('');

    // 회원가입 요청
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 프로필 추가
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          user_id: data.user.id, // auth.users의 ID
          username: email.split('@')[0], // 기본값 (이메일 앞부분)
          email,
          avatar_url: '', // 기본값 설정 가능
        },
      ]);

      if (profileError) {
        setError(`프로필 생성 실패: ${profileError.message}`);
        setLoading(false);
        return;
      }
    }

    alert('회원가입 성공! 이메일을 확인하세요.');
    router.push('/login');
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
