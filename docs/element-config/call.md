# 配置 Element Call

## 配置 Synapse

修改 `/.well-known/matrix/client`

```jsonc
// https://example.com/.well-known/matrix/client
{
  "m.homeserver": {
    "base_url": "https://example.com/"
  },
  "org.matrix.msc4143.rtc_foci": [
    {
      "type": "livekit",
      "livekit_service_url": "https://call.example.com/livekit/jwt"
    }
  ]
}
```

::: details Synapse Only

如果你使用 Synapse，而且没有使用反向代理，修改 `/.well-known/matrix/client` 需要配置这个

```yaml
extra_well_known_client_content:
  "org.matrix.msc4143.rtc_foci":
    - type: livekit
      livekit_service_url: "https://call.example.com/livekit/jwt"
```
:::

配置 `homeserver.yaml`

```yaml
# synapse/data/homeserver.yaml
matrix_rtc:
  transports:
    - type: livekit
      livekit_service_url: "https://call.example.com/livekit/jwt"
```

## 配置 Lk-jwt

不推荐使用apt下载，因为没有仓库提供，直接下载可执行文件吧

下载 [https://github.com/element-hq/lk-jwt-service](https://github.com/element-hq/lk-jwt-service/releases/latest)

```bash
export LIVEKIT_JWT_BIND=:8080
export LIVEKIT_URL=https://call.example.com:7880
export LIVEKIT_KEY=<32-character string>
export LIVEKIT_SECRET=<64-character string>
export LIVEKIT_FULL_ACCESS_HOMESERVERS=example.com
lk-jwt-service_linux_amd64
```

::: details Systemd Configuration
```systemd
[Unit]
Description=LiveKit JWT Service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=10
Environment="LIVEKIT_JWT_BIND=:8080"
Environment="LIVEKIT_URL=https://call.example.com:7880"
Environment="LIVEKIT_KEY=<32-character string>"
Environment="LIVEKIT_SECRET=<64-character string>"
Environment="LIVEKIT_FULL_ACCESS_HOMESERVERS=example.com"
ExecStart=/usr/bin/lk-jwt-service_linux_amd64

[Install]
WantedBy=multi-user.target
```
:::

## 配置 Livekit-server

下载 [https://github.com/livekit/livekit](https://github.com/livekit/livekit/releases/latest)

```bash
livekit-server --config /etc/livekit.yaml
```

::: details Systemd Configuration
```systemd
[Unit]
Description=LiveKit Server
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=10
ExecStart=/usr/bin/livekit-server --config /etc/livekit.yaml
StandardOutput=journal
StandardError=journal

LimitNOFILE=65536
LimitNPROC=65536

[Install]
WantedBy=multi-user.target
```
:::

```yaml
# /etc/livekit.yaml
port: 7880
bind_addresses:
  - "0.0.0.0"
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 55000
  use_external_ip: true
logging:
  level: info
keys:
  <32-character string>: <64-character string>
```

## 配置 Nginx

强烈建议配置 Nginx，否则 livekit 独占 443 端口

下载

```bash
apt update && apt install nginx
```

::: details Systemd Configuration
```systemd
[Unit]
Description=A high performance web server and a reverse proxy server
Documentation=man:nginx(8)
After=network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target
ConditionFileIsExecutable=/usr/sbin/nginx

[Service]
Type=forking
PIDFile=/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t -q -g 'daemon on; master_process on;'
ExecStart=/usr/sbin/nginx -g 'daemon on; master_process on;'
ExecReload=/usr/sbin/nginx -g 'daemon on; master_process on;' -s reload
ExecStop=-/sbin/start-stop-daemon --quiet --stop --retry QUIT/5 --pidfile /run/nginx.pid
TimeoutStopSec=5
KillMode=mixed

[Install]
WantedBy=multi-user.target
```
:::

添加这个文件
```nginx
# /etc/nginx/sites-enabled/matrix-call.conf
server {
    listen 443 ssl;
    server_name call.example.com;
    
    ssl_certificate /acme.sh/call.example.com.crt;
    ssl_certificate_key /acme.sh/call.example.com.key;
    
    location /livekit/jwt/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /livekit/sfu/ {
        proxy_pass http://localhost:7880/;
        proxy_buffering off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        
        proxy_buffers 8 16k;
        proxy_buffer_size 32k;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}

```

修改以下这行

```nginx{4}
# /etc/nginx/nginx.conf
http {
	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*.conf;
}
```

重新启动 Nginx

```bash
systemctl restart nginx
```

## 服务器放行端口

443/tcp

> Nginx

50000-55000/udp

> Livekit-server
