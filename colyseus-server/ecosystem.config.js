module.exports = {
  apps: [{
    name: 'colyseus-server',
    script: 'build/index.js',
    instances: 1, // CRITICAL: Only one instance to prevent EADDRINUSE
    exec_mode: 'fork', // CRITICAL: Use fork mode, not cluster mode
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
    kill_timeout: 10000, // Increased to 10 seconds
    wait_ready: false,
    listen_timeout: 15000, // Increased to 15 seconds
    shutdown_with_message: true,
    // CRITICAL: Stop all instances before starting new one
    stop_exit_codes: [0],
    min_uptime: '30s', // Increased to 30 seconds
    max_restarts: 3, // Reduced to 3 restarts
    restart_delay: 10000, // Increased to 10 seconds
    // CRITICAL: Force single instance
    force: false, // Don't force start if already running
    // CRITICAL: Wait for graceful shutdown
    wait_ready_timeout: 0, // Don't wait for ready signal
    // CRITICAL: Prevent duplicate instances
    unique: true // Ensure only one instance with this name
  }]
};
