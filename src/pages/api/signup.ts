// src/pages/api/signup.ts
import pb from "../../utils/pb";

export const POST = async ({ request, cookies }: any) => {
  const { email, password, passwordConfirm, username } = await request.json();
  try {
    const record = await pb.collection("users").create({
      email,
      password,
      passwordConfirm,
      username,
    });

    // Se connecter de suite (optionnel)
    const authData = await pb.collection("users").authWithPassword(email, password);
    cookies.set("pb_auth", pb.authStore.exportToCookie(), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    return new Response(JSON.stringify({ user: authData.record }), { status: 200 });
  } catch (err) {
    console.error("Erreur signup:", err);
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 400 });
  }
};
