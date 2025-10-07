// src/pages/api/updateSVG.js
import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export async function POST({ request }) {
  const data = await request.json();
  console.log("Received update data:", data);

  try {
    const record = await pb
      .collection(Collections.Svg)
      .update(data.id, data);

    return new Response(JSON.stringify({ success: true, id: record.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating SVG:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
