// src/utils/pb.js
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090");

// Si tu utilises l'auth persistante côté client
if (typeof window !== "undefined") {
  pb.authStore.loadFromCookie(document.cookie);
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  });
}

export default pb;
