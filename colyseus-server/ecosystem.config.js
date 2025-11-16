module.exports = {
  apps: [{
    name: 'colyseus-server',
    script: 'build/index.js',
    instances: 1, // CRITICAL: Only one instance
    exec_mode: 'fork', // CRITICAL: Use fork mode
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 2567
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // CRITICAL: Aggressive settings to prevent EADDRINUSE
    kill_timeout: 20000, // 20 seconds to kill old process
    wait_ready: false,
    listen_timeout: 30000, // 30 seconds timeout for server to start listening
    shutdown_with_message: true,
    stop_exit_codes: [0, 1], // Accept both success and error exits
    min_uptime: '60s', // Must run for 60 seconds before considered stable
    max_restarts: 5, // Allow 5 restarts
    restart_delay: 15000, // Wait 15 seconds before restart
    force: false, // Don't force start if already running
    wait_ready_timeout: 0, // Don't wait for ready signal
    unique: true // Only one instance with this name
  }]
};
