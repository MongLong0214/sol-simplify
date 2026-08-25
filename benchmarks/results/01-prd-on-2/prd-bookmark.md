# 게시글 북마크 기능 PRD

## 1. 개요

로그인 사용자가 게시글을 북마크하거나 해제하고, 마이페이지에서 자신이 북마크한 게시글을 다시 찾을 수 있게 한다.

### 목표

- 게시글 화면에서 현재 사용자의 북마크 여부를 확인하고 변경할 수 있다.
- 같은 게시글은 사용자당 한 번만 북마크된다.
- 마이페이지에서 최신 북마크순으로 목록을 조회할 수 있다.
- 사용자는 다른 사용자의 북마크 데이터를 읽거나 변경할 수 없다.

### 범위 밖

- 북마크 폴더, 태그, 메모
- 북마크 수 공개 및 인기 순위
- 목록 검색, 사용자 지정 정렬, 일괄 삭제
- 북마크 공유, 알림, 추천 연동

## 2. 전제

- Supabase Auth와 게시글 테이블이 이미 존재한다.
- 아래 예시는 게시글 ID를 `uuid`로 표현한다. 실제 `posts.id` 타입이 다르면 동일한 타입으로 맞춘다.
- 사용자가 볼 수 없는 게시글은 북마크 목록에도 노출하지 않는다.

## 3. 사용자 흐름

### 게시글 북마크

1. 사용자가 게시글 화면을 연다.
2. 시스템이 해당 사용자의 북마크 여부를 표시한다.
3. 사용자가 북마크 버튼을 누르면 즉시 선택 상태로 보이고 서버에 저장된다.
4. 저장에 실패하면 이전 상태로 되돌리고 재시도 가능한 오류를 알린다.
5. 선택된 버튼을 다시 누르면 북마크가 해제된다.

로그아웃 사용자가 버튼을 누르면 로그인 화면으로 이동하며, 로그인 후 원래 게시글로 돌아올 수 있도록 현재 경로를 보존한다.

### 마이페이지 목록

1. 사용자가 마이페이지의 `북마크` 영역을 연다.
2. 시스템이 최신 북마크순으로 게시글 목록을 보여준다.
3. 항목을 선택하면 해당 게시글로 이동한다.
4. 더 불러올 데이터가 있으면 커서 기반으로 다음 목록을 요청한다.

## 4. 기능 요구사항

### 북마크 버튼

- 게시글 상세와 서비스가 이미 제공하는 게시글 카드 중 북마크 동작이 필요한 위치에 표시한다.
- 미선택과 선택 상태를 아이콘 형태뿐 아니라 색상, 텍스트 대체 정보로 구분한다.
- 버튼에 `aria-pressed`를 적용하고 상태에 따라 접근 가능한 이름을 `북마크 추가` 또는 `북마크 해제`로 제공한다.
- 요청 중에는 동일 요청이 중복 제출되지 않게 버튼을 비활성화한다.
- 추가와 삭제 API는 같은 요청을 반복해도 최종 상태가 같도록 멱등하게 처리한다.
- 북마크 수는 표시하지 않는다.

### 북마크 목록

- 각 항목은 기존 게시글 카드 컴포넌트를 재사용하고 `북마크한 시각`을 데이터로 제공한다.
- 정렬은 `bookmarked_at DESC`, 동률이면 `post_id DESC`로 고정한다.
- 초기 로딩, 추가 로딩, 빈 목록, 오류와 재시도 상태를 제공한다.
- 삭제되었거나 현재 사용자에게 조회 권한이 없는 게시글은 노출하지 않는다.
- 목록에서 북마크를 해제하면 해당 항목을 즉시 제거하고, 실패 시 복구한다.

## 5. 데이터 모델 및 보안

```sql
create table public.bookmarks (
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  post_id uuid not null
    references public.posts(id) on delete cascade,
  bookmarked_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- 사용자별 최신 목록 조회와 커서 페이지네이션
create index bookmarks_user_recent_idx
  on public.bookmarks (user_id, bookmarked_at desc, post_id desc);

-- 게시글 삭제 시 FK 검사와 cascade 처리
create index bookmarks_post_id_idx
  on public.bookmarks (post_id);

revoke all on public.bookmarks from anon;
grant select, insert, delete on public.bookmarks to authenticated;

alter table public.bookmarks enable row level security;

create policy "users can read own bookmarks"
  on public.bookmarks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "users can create own bookmarks"
  on public.bookmarks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can delete own bookmarks"
  on public.bookmarks for delete to authenticated
  using ((select auth.uid()) = user_id);
```

- 업데이트 정책은 만들지 않는다. 북마크에는 변경 가능한 속성이 없으며 추가와 삭제만 허용한다.
- API는 요청 본문의 사용자 ID를 받지 않고 Supabase 세션의 사용자 ID만 사용한다.
- Route Handler는 사용자 세션이 바인딩된 Supabase 클라이언트를 사용하며 RLS를 우회하는 service role 키를 사용하지 않는다.
- 게시글 조회 권한은 기존 `posts` RLS를 그대로 적용한다.
- 동일한 `(user_id, post_id)` 삽입은 `ON CONFLICT DO NOTHING`으로 처리한다.

## 6. API 계약

Next.js App Router의 Route Handler가 서버용 Supabase 클라이언트로 세션을 확인한다.
모든 응답은 사용자별 데이터이므로 공유 캐시에 저장하지 않는다.

### `GET /api/posts/{postId}/bookmark`

- 성공: `{ "bookmarked": true | false }`
- 로그인되지 않은 요청: `401`

### `PUT /api/posts/{postId}/bookmark`

- 현재 사용자의 북마크를 생성한다. 이미 존재하면 성공으로 처리한다.
- 성공: `{ "bookmarked": true, "bookmarkedAt": "..." }`
- 로그인되지 않은 요청: `401`
- 존재하지 않거나 사용자가 볼 수 없는 게시글: `404`

### `DELETE /api/posts/{postId}/bookmark`

- 현재 사용자의 북마크를 삭제한다. 이미 없으면 성공으로 처리한다.
- 성공: `{ "bookmarked": false }`
- 로그인되지 않은 요청: `401`

### `GET /api/me/bookmarks?cursor={cursor}`

- 응답: `{ "items": [{ "post": { ... }, "bookmarkedAt": "..." }], "nextCursor": "..." | null }`
- 커서는 `bookmarked_at`과 `post_id`를 함께 담아 동률에서도 중복이나 누락 없이 이어서 조회한다.
- 로그인되지 않은 요청: `401`

## 7. 클라이언트 상태 관리

- React Query 키는 북마크 상태에 `['bookmark', userId, postId]`, 목록에 `['bookmarks', userId]`를 사용해 사용자 전환 시 캐시가 섞이지 않게 한다.
- 추가·해제 시 해당 버튼과 마이페이지 목록에 낙관적 업데이트를 적용한다.
- mutation 전에 관련 캐시를 저장하고, 오류 시 저장한 값으로 롤백한다.
- 성공 시 서버 응답으로 북마크 상태를 확정하고 목록 쿼리를 재검증한다.
- 게시글 상세 응답을 변경할 수 있다면 `viewerHasBookmarked`를 포함해 별도 상태 요청을 줄인다. 이 값은 로그인 사용자별 데이터이므로 공유 캐시에 섞이지 않게 한다.
- 목록은 `useInfiniteQuery`와 서버가 반환한 `nextCursor`를 사용한다.

## 8. 오류 및 경계 조건

- 세션 만료: 낙관적 변경을 되돌리고 다시 로그인하도록 안내한다.
- 네트워크 또는 서버 오류: 기존 상태를 복구하고 재시도 수단을 제공한다.
- 빠른 연속 클릭: mutation 진행 중 추가 입력을 막아 순서 역전을 방지한다.
- 다른 탭에서 상태 변경: 창 포커스 복귀 또는 명시적 재검증 시 서버 상태와 동기화한다.
- 게시글 삭제: FK `ON DELETE CASCADE`로 관련 북마크를 함께 제거한다.
- 게시글 공개 범위 변경: 목록 조회 시 기존 게시글 RLS가 적용되어 접근 불가 항목을 반환하지 않는다.

## 9. 수용 기준

- 로그인 사용자가 게시글에서 북마크를 추가하면 버튼이 선택 상태가 되고 새로고침 후에도 유지된다.
- 선택된 북마크 버튼을 누르면 해제되고 새로고침 후에도 해제 상태가 유지된다.
- 같은 사용자가 같은 게시글을 반복 추가해도 북마크 행은 하나뿐이다.
- 사용자 A는 사용자 B의 북마크를 조회, 생성 또는 삭제할 수 없다.
- 마이페이지는 현재 사용자의 북마크만 최신순으로 보여주고 각 항목은 게시글로 연결된다.
- 다음 페이지를 불러올 때 항목이 중복되거나 누락되지 않는다.
- 목록에서 북마크를 해제하면 항목이 즉시 사라지며, 요청 실패 시 원래 위치로 복구된다.
- 로그아웃 상태의 북마크 API 요청은 데이터를 변경하지 않고 `401`을 반환한다.
- 삭제되거나 접근 권한이 사라진 게시글은 북마크 목록에 노출되지 않는다.
- 키보드와 스크린 리더로 북마크의 현재 상태를 확인하고 변경할 수 있다.

`skipped: ceremony — rollout plan, KPIs, ADR. Say the word.`
