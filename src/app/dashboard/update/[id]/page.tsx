'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './update.module.scss';

const UpdatePost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        setError('포스트를 불러오는데 실패했습니다.');
        return;
      }
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
    };

    fetchPost();
  }, [id]);

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

    try {
      const { error } = await supabase
        .from('posts')
        .update({ title, content, updated_at: new Date() })
        .eq('id', id)
        .eq('email', user.email);

      if (error) {
        throw error;
      }

      alert('포스트가 성공적으로 업데이트되었습니다!');
      router.push('/dashboard'); // 대시보드 페이지로 리다이렉트
    } catch (error) {
      setError('포스트 업데이트에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return <div>포스트를 불러오는 중...</div>;
  }

  return (
    <div className={styles['dashboard-container']}>
      <div className={styles['dashboard-header']}>
        <h1>포스트 수정</h1>
      </div>
      <div className={styles['dashboard-content']}>
        <form className={styles.form} onSubmit={handleUpdatePost}>
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
            {loading ? '로딩 중...' : '포스트 수정'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
