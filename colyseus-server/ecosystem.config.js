module.exports = {
  apps: [{
    name: 'colyseus-server',
    script: 'build/index.js',
    instances: 1, // CRITICAL: Only one instance to prevent EADDRINUSE
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 2567
    },
    // Remove log files - Colyseus Cloud handles logging
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // CRITICAL: Prevent multiple instances from starting simultaneously
    kill_timeout: 5000,
    wait_ready: false,
    listen_timeout: 10000,
    shutdown_with_message: true,
    // CRITICAL: Stop all instances before starting new one
    stop_exit_codes: [0],
    min_uptime: '10s',
    max_restarts: 5,
    restart_delay: 4000
  }]
};
