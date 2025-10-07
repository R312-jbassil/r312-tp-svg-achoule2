// src/pages/api/logout.ts
export const POST = async ({ cookies }: any) => {
  cookies.delete("pb_auth", { path: "/" });
  return new Response(null, { status: 303, headers: { Location: "/" } });
};

