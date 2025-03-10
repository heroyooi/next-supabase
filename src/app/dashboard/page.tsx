'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.scss';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Dashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // 포스트 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*');

      if (error) {
        setError('포스트 목록을 불러오는 데 실패했습니다.');
        setLoading(false);
        return;
      }

      setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // 포스트 삭제
  const handleDeletePost = async (id: number) => {
    if (window.confirm('정말로 이 포스트를 삭제하시겠습니까?')) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', id);

        if (error) {
          throw error;
        }

        // 삭제 후 포스트 목록 업데이트
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        alert('포스트가 성공적으로 삭제되었습니다!');
      } catch (error) {
        console.error(error);
        alert('포스트 삭제에 실패했습니다.');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // ✅ 로그아웃 (쿠키 삭제)
    router.push('/login');
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles['dashboard-container']}>
      <div className={styles['dashboard-header']}>
        <h1>대시보드</h1>
      </div>
      <div className={styles['dashboard-content']}>
        <button
          className={styles.button} // button 클래스 적용
          onClick={() => router.push('/dashboard/create')}
        >
          새 포스트 만들기
        </button>
        <div className={styles['post-list']}>
          {posts.length === 0 ? (
            <p>등록된 포스트가 없습니다.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={styles.card}>
                <div className={styles['card-header']}>
                  <h2>{post.title}</h2>
                </div>
                <div className={styles['card-body']}>
                  <p>{post.content}</p>
                </div>
                <div className={styles['card-footer']}>
                  <button
                    className={styles.button} // button 클래스 적용
                    onClick={() => router.push(`/dashboard/update/${post.id}`)}
                  >
                    수정
                  </button>
                  <button
                    className={styles.button} // button 클래스 적용
                    onClick={() => handleDeletePost(post.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default Dashboard;
