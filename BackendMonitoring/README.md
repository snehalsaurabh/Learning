# Backend Monitoring Playground

A simple Express service that shows how Prometheus, Grafana, and Loki work together. We're monitoring three routes: `/`, `/heavy-computation`, and `/metrics`.

## What We're Building

We're using four tools to monitor our backend:

- **Prometheus** - Collects metrics (response time, CPU, memory) every 5 seconds
- **Grafana** - Shows dashboards for both metrics and logs
- **Loki** - Stores our application logs
- **Promtail** - Automatically sends container logs to Loki

### Why Use Both Prometheus and Loki?

- **Prometheus** answers: "How many requests per second? What's the response time?"
- **Loki** answers: "What error was logged? Why did it fail?"
- **Together in Grafana**, we can see a latency spike in Prometheus and click through to the exact error log in Loki.

---

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This installs: `express`, `response-time`, `prom-client`, `winston`, `winston-loki`

### Step 2: Start Everything

All configuration files are ready. We just need one command:

```bash
docker compose up -d
```

Wait 10-15 seconds for all services to start.

### Step 3: Access Our Services

Once running, we can visit:

- **Our App**: `http://localhost:3000`
- **Prometheus**: `http://localhost:9090` (see metrics)
- **Grafana**: `http://localhost:4000` (login: `admin/admin` on first run)
- **Loki**: Query through Grafana → Explore menu (no standalone UI)

### Step 4: Stop Everything

When we're done:

```bash
docker compose down
```

To also remove saved data (dashboards, logs):

```bash
docker compose down -v
```

---

## What Each Tool Does

### Prometheus

- Scrapes our `/metrics` endpoint every 5 seconds
- Stores numerical data: request counts, response times, CPU usage, memory
- Perfect for alerts and trend analysis

### Grafana

- Makes pretty charts and dashboards
- Reads from both Prometheus (metrics) and Loki (logs)
- Pre-configured to connect to both when it starts

### Loki

- Stores our logs
- Fast because it indexes by labels instead of searching log text
- Keeps logs for 7 days by default

### Promtail

- Watches our Docker containers
- Automatically sends container logs to Loki
- Only forwards logs from containers we label (our backend service)

---

## Configuration Files

We have 5 config files. Here's what each does:

### 1. `prometheus-config.yml`

Tells Prometheus where to get metrics from:

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'prometheus-backend-monitoring'
    static_configs:
      - targets: ['backend:3000']
```

**Important**: If we run the app outside Docker, change `backend:3000` to `localhost:3000` or the actual IP address.

### 2. `loki-config.yml`

Basic Loki setup:
- Stores data in a Docker volume
- Keeps logs for 7 days (168 hours)
- Single-node setup (simple for learning)

### 3. `promtail-config.yml`

Tells Promtail to:
- Watch Docker containers
- Only send logs from containers labeled `promtail=true`
- Send those logs to Loki

Our backend service has the `promtail: "true"` label, so only our app logs go to Loki.

### 4. `grafana-datasource.yml`

Automatically connects Grafana to Prometheus and Loki when it starts. No manual setup needed.

### 5. `docker-compose.yml`

Runs all our services together:
- **backend** - Our Express app (`index.js`)
- **prom-server** - Prometheus server
- **loki** - Loki log storage  
- **grafana** - Grafana dashboard
- **promtail** - Log shipper

**Note**: Grafana runs on port 4000 (instead of 3000) so it doesn't conflict with our app.

---

## What We're Monitoring

1. **Response times** - All Express routes are tracked with a histogram
2. **Errors** - Heavy computation failures are logged to Loki
3. **Process stats** - CPU and memory usage from `prom-client`

### Our Code

- `index.js` - Main Express server with `/metrics` endpoint
- `heavyComputation.js` - Simulates variable latency and random errors
- Uses `prom-client` to collect metrics
- Uses `winston-loki` to ship logs to Loki

---

## Running Without Docker (Optional)

If we want to run the app directly on our machine instead of in Docker:

1. Install dependencies:
```bash
npm install
```

2. Set the Loki host:
```bash
export LOKI_HOST=http://localhost:3100
```

3. Start the app:
```bash
node index.js
```

Then we'd need to run Prometheus, Loki, and Grafana separately using Docker or local installs. Using Docker Compose is much easier for this project.

---

## Next Steps

1. Create dashboards in Grafana showing metrics and logs together
2. Set up alerts in Prometheus or Grafana
3. Test error tracking - call `/heavy-computation` multiple times until it errors, then watch the logs appear in Loki

This is a simple backend monitoring mini-project for learning the observability stack.
