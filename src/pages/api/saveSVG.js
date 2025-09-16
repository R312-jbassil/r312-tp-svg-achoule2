import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // adapte si tu héberges ailleurs

export const POST = async ({ request }) => {
  const { name, code } = await request.json();

  try {
    const record = await pb.collection('svgs').create({ name, code });
    return new Response(JSON.stringify({ success: true, id: record.id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};
