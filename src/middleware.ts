// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import pb from "../utils/pb";

export const onRequest = defineMiddleware(async (context, next) => {
  const cookie = context.cookies.get("pb_auth")?.value;

  if (cookie) {
    pb.authStore.loadFromCookie(cookie);
    try {
      // Optionnel: rafraîchir l’auth pour valider le token
      if (pb.authStore.isValid) {
        await pb.collection("users").authRefresh();
      }
    } catch {
      pb.authStore.clear();
    }
    if (pb.authStore.isValid) {
      context.locals.user = pb.authStore.record;
    }
  }

  // Protection des endpoints API: tout /api/* exige auth sauf /api/login et /api/signup
  if (context.url.pathname.startsWith("/api/")) {
    if (!context.locals.user && !["/api/login", "/api/signup"].includes(context.url.pathname)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return next();
  }

  // Redirection vers /login si non connecté, sauf pour pages publiques
  const isPublic = ["/login", "/signup", "/"].includes(context.url.pathname);
  if (!context.locals.user && !isPublic) {
    return Response.redirect(new URL("/login", context.url), 303);
  }

  const response = await next();

  // Renvoie l’état auth courant dans un Set-Cookie pb_auth à jour
  response.headers.append("set-cookie", pb.authStore.exportToCookie());
  return response;
});
