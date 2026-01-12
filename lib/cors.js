// CORS Configuration
export function enableCORS(response) {
  // อนุญาต frontend ที่หลากหลาย
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '3600');
  
  return response;
}

export function handleCORS(request) {
  // ตอบสนอง OPTIONS request
  if (request.method === 'OPTIONS') {
    const response = new Response(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '3600');
    return response;
  }
  
  return null;
}
