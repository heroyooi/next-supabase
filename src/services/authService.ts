import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Supabase 클라이언트 생성
const supabase = createClientComponentClient();

// ✅ 로그인 & 세션 설정
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

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

    return data.user;
  } catch (err) {
    throw err;
  }
}

// ✅ 회원가입 & 프로필 등록
export async function signUpWithProfile(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    // 유저 정보 확인 후 프로필 생성
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          user_id: data.user.id, // auth.users의 ID
          username: email.split('@')[0], // 기본값 (이메일 앞부분)
          email,
          avatar_url: '', // 기본값 설정 가능
        },
      ]);

      if (profileError)
        throw new Error(`프로필 생성 실패: ${profileError.message}`);
    }

    return data.user;
  } catch (err) {
    throw err;
  }
}

// ✅ 현재 로그인한 유저 정보 가져오기
export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (err) {
    console.error('유저 정보를 가져오는 중 오류 발생:', err);
    return null;
  }
}

// ✅ 로그아웃
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (err) {
    throw err;
  }
}
