'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '@/app/dashboard/dashboard.module.scss';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { deletePost, getPostById, getPosts } from '@/services/postService';
import Link from 'next/link';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any[]>([]);
  const router = useRouter();

  // 포스트 목록 불러오기
  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPostById(Number(id));
        setPost(data);
      } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
      }
    }
    fetchPost();
  }, []);

  const handleDelete = async () => {
    try {
      await deletePost(Number(id));
      alert('삭제되었습니다.');
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className={styles['dashboard-container']}>
      <div className={styles['dashboard-header']}>
        <h1>상세</h1>
      </div>
      <div className={styles['dashboard-content']}>
        <div>
          <div className={styles['card-header']}>
            <h2>{post.title}</h2>
          </div>
          <div className={styles['card-body']}>
            <p>{post.content}</p>
          </div>
          <div className={styles['card-footer']}>
            <button onClick={() => router.push(`/dashboard/update/${id}`)}>
              수정
            </button>
            <button onClick={handleDelete}>삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
