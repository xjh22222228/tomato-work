// pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: 'tomato-work-server',
      port: '7003',
      exec_mode: 'cluster',
      instances: 'max',
      script: './dist/src/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
