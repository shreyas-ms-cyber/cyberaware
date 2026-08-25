import serve from 'serve';

const server = serve('dist', {
  port: 8081,
  ignore: ['node_modules'],
  single: true,
  headers: [
    {
      source: '**/*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline';"
        }
      ]
    }
  ]
});

console.log('✅ CyberAware running at http://localhost:8081');
console.log('Press Ctrl+C to stop');
