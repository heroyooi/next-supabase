'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './create.module.scss'; // SCSS 파일 임포트

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ✅ 현재 로그인된 사용자 세션 가져오기
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData?.session?.user) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    // ✅ 사용자 정보 가져오기 (Optional Chaining 사용)
    const user = sessionData.session.user;
    if (!user) {
      setError('사용자 정보를 가져올 수 없습니다.');
      setLoading(false);
      return;
    }

    const userId = user.id;
    const email = user.email; // ✅ email 가져오기

    try {
      const { data, error } = await supabase.from('posts').insert([
        {
          title,
          content,
          email,
          user_id: userId,
          created_at: new Date(),
        },
      ]);

      if (error) {
        throw error;
      }

      // 성공적으로 포스트가 생성되면 폼 초기화
      setTitle('');
      setContent('');
      alert('포스트가 성공적으로 생성되었습니다!');
    } catch (error) {
      setError('포스트 생성에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['dashboard-container']}>
      <div className={styles['dashboard-header']}>
        <h1>새 포스트 만들기</h1>
      </div>
      <div className={styles['dashboard-content']}>
        <form className={styles.form} onSubmit={handleCreatePost}>
          <div>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          {error && <div className={styles['error-message']}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? '로딩 중...' : '포스트 생성'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
