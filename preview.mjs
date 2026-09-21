import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// Bundle only the preview response; never write back to the production output.
export function createPreviewServer(directory = 'dist') {
  return createServer(async (request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (!['/', '/index.html', '/yoren.md'].includes(path)) {
      response.writeHead(404).end('Not found');
      return;
    }
    try {
      let body;
      if (path === '/yoren.md') {
        body = await readFile(resolve(directory, 'yoren.md'));
      } else {
        const [html, css, script, font, icon] = await Promise.all(
          ['index.html', 'style.css', 'navigation.js', 'fonts/source-serif-4-latin-wght-normal.woff2', 'favicon.svg']
            .map(file => readFile(resolve(directory, file)))
        );
        const styles = css.toString().replace('/fonts/source-serif-4-latin-wght-normal.woff2', `data:font/woff2;base64,${font.toString('base64')}`);
        body = Buffer.from(html.toString()
          .replace(/<link rel="preload"[^>]+>/, '')
          .replace('<link rel="stylesheet" href="/style.css">', () => `<style>${styles}</style>`)
          .replace('<script src="/navigation.js" defer></script>', '')
          .replace('href="/favicon.svg"', `href="data:image/svg+xml;base64,${icon.toString('base64')}"`)
          // At the end of body, the navigation DOM exists just as with defer.
          .replace('</body>', () => `<script>${script.toString().replaceAll('</script', '<\\/script')}</script></body>`));
      }
      const compressed = /\bgzip\b/.test(request.headers['accept-encoding'] ?? '');
      if (compressed) body = gzipSync(body);
      response.writeHead(200, {
        'Content-Type': path === '/yoren.md' ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Vary': 'Accept-Encoding',
        ...(compressed ? { 'Content-Encoding': 'gzip' } : {}),
        'Content-Length': body.length,
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      response.writeHead(500).end('Preview unavailable. Run npm run build first.');
      console.error(error.message);
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createPreviewServer().listen(4173, '0.0.0.0', () => console.log('Preview listening on port 4173'));
}
