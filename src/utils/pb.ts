// src/utils/pb.ts
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.PUBLIC_PB_URL || "http://127.0.0.1:8090");

// Optionnel: synchroniser depuis/vers cookie au besoin côté serveur
export default pb;
