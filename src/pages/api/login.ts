// src/pages/api/login.ts
import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export const POST = async ({ request, cookies }: any) => {
  const { email, password } = await request.json();

  try {
    const authData = await pb.collection(Collections.Users).authWithPassword(email, password);
    // Écrit le cookie d’auth (pb_auth=...) avec options de sécurité
    cookies.set(
      "pb_auth",
      pb.authStore.exportToCookie({
        // L’SDK retourne une chaîne "pb_auth=...; Path=/; ..." si utilisé directement
        // Ici on ne passe que les attributs personnalisés côté SDK si besoin
        // On laisse Astro fixer httpOnly/sameSite/expires via cookies.set
      }),
      {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    );

    return new Response(JSON.stringify({ user: authData.record }), { status: 200 });
  } catch (err) {
    console.error("Erreur de connexion :", err);
    return new Response(JSON.stringify({ error: "Identifiants invalides" }), { status: 401 });
  }
};
