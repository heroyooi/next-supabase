import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  // ✅ 서버에서 로그인된 유저 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('🔍 서버에서 가져온 유저 정보:', user); // 디버깅용

  if (user) {
    redirect('/dashboard'); // ✅ 로그인된 경우 대시보드로 이동
  } else {
    redirect('/login'); // ❌ 로그인 안 된 경우 로그인 페이지로 이동
  }

  return null;
}
