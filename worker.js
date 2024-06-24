const WORKER_URL = '<你的外部worker地址,如:https://xxxxxx.xxxxxxxx.workers.dev>'
const availableModels = ["@cf/bytedance/stable-diffusion-xl-lightning", "@cf/stabilityai/stable-diffusion-xl-base-1.0", "@cf/lykon/dreamshaper-8-lcm"]

export default {
  async fetch(req, env, ctx) {
    if (req.method === "OPTIONS") {
      return new Response("", {
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Access-Control-Allow-Headers": '*'
        }, status: 204
      })
    }
    const url_r = new URL(req.url);
    if (url_r.pathname === '/v1/img' && req.method === 'GET') {
      const get_img_key = url_r.searchParams.get('key');
      const object = await env.R2.get(get_img_key);

      if (object === null) {
        return new Response('Object Not Found', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('content-type', 'image/png');
      return new Response(object.body, {
        headers,
      });
    }

    if (url_r.pathname !== '/v1/images/generations' || req.method !== 'POST') {
      return new Response('Hello World1', { status: 200 });
    }

    const authorizationHeader = req.headers.get('Authorization')

    if (!authorizationHeader) {
      return new Response('Authorization header is missing', { status: 401 })
    }
    //const apiKey = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.substring(7) : authorizationHeader

    const body = await req.text();
    let bodyJson
    try {
      bodyJson = JSON.parse(body)
    } catch (e) {
      return new Response('Invalid JSON', { status: 400 })
    }

    // 提取特定字段
    let model = bodyJson.model
    const prompt_ai = bodyJson.prompt
    const n = bodyJson.n
    // const size = bodyJson.size
    //console.log(bodyJson)

    if (!availableModels.includes(model)) {
      model = "@cf/stabilityai/stable-diffusion-xl-base-1.0"
    }

    if (prompt_ai.length < 1) {
      return new Response('Invalid prompt', { status: 400 })
    }

    if (n != 1) {
      return new Response('Invalid n', { status: 400 })
    }
    const inputs = {
      prompt: prompt_ai,
    };
    const imageData = await env.AI.run(model, inputs);
    const timeNow = Math.floor(Date.now() / 1000);
    const imgKey = (await getMD5(`${prompt_ai}${timeNow}`))
    await env.R2.put(imgKey, imageData);

    const jsonResponse = {
      "created": timeNow,
      "data": [
        {
          "url": `${WORKER_URL}/v1/img?key=${imgKey}`
        }
      ]
    };

    // 返回 R2 地址
    return new Response(JSON.stringify(jsonResponse), {
      headers: {
        "content-type": "application/json",
      },
    });
  },
}


async function getMD5(string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


