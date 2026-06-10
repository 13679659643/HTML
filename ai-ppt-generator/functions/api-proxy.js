// ============================================================================
// Cloudflare Pages Function - CORS 代理
// ============================================================================
//
// 文件路径：functions/api-proxy.ts（Cloudflare Pages 自动识别 functions/ 目录）
//
// 功能：
//   充当 CORS 代理，转发前端页面的 API 请求到目标服务器
//   支持所有模型服务商（通义千问、Kimi、DeepSeek、智谱、腾讯元宝、豆包等）
//
// 请求格式：
//   POST /api-proxy?url=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
//   Header: Authorization: Bearer <API_KEY>
//   Body: { model: "qwen-max", messages: [...], ... }
//
// 部署方式：
//   1. 将此文件放在项目的 functions/ 目录下
//   2. 用 wrangler 或 Cloudflare Dashboard 部署
//   3. 部署后 /api-proxy 路径会自动由此函数处理
//
// ============================================================================

export async function onRequest(context) {
  const { request } = context;

  // ---- 处理 OPTIONS 预检请求（CORS 要求） ----
  // 浏览器在发送 POST 请求前会先发一个 OPTIONS 请求确认是否允许跨域
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // 缓存 24 小时
      },
    });
  }

  // ---- 获取目标 URL ----
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: { message: 'Missing url parameter. Use: /api-proxy?url=<target_api_url>' } }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // ---- 转发请求到目标 API ----
  try {
    // 读取请求体（前端发送的 JSON 数据）
    const body = await request.text();

    // 构造转发请求的 Headers
    const forwardHeaders = new Headers();
    forwardHeaders.set('Content-Type', 'application/json');

    // 转发 Authorization 头（API Key 在这里）
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      forwardHeaders.set('Authorization', authHeader);
    }

    // 发送请求到目标 API 服务器
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: body,
    });

    // 读取目标 API 的响应
    const responseBody = await response.text();

    // 返回响应给前端，附带 CORS 头
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    // 代理出错时返回错误信息
    return new Response(
      JSON.stringify({
        error: {
          message: 'Proxy error: ' + error.message,
          target: targetUrl,
        },
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
