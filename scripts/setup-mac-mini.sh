#!/bin/bash
# ═══════════════════════════════════════════════════════════
# DieHardNation Mac Mini Setup
# Run ONCE on the Mac Mini to set up permanent automation
# ssh jeffsutherland@100.93.179.28 then run this script
# ═══════════════════════════════════════════════════════════

set -e
echo "Setting up DieHardNation Mac Mini automation..."

# 1. Make Ollama always listen on network
if ! grep -q 'OLLAMA_HOST=0.0.0.0' ~/.zshrc 2>/dev/null; then
  echo 'export OLLAMA_HOST=0.0.0.0' >> ~/.zshrc
  echo "Added OLLAMA_HOST to .zshrc"
fi
if ! grep -q 'OLLAMA_HOST=0.0.0.0' ~/.bashrc 2>/dev/null; then
  echo 'export OLLAMA_HOST=0.0.0.0' >> ~/.bashrc
  echo "Added OLLAMA_HOST to .bashrc"
fi

# 2. Create Ollama launchd plist (auto-start on boot)
PLIST_PATH="$HOME/Library/LaunchAgents/com.ollama.server.plist"
mkdir -p "$HOME/Library/LaunchAgents"

OLLAMA_PATH=$(which ollama 2>/dev/null || echo "/usr/local/bin/ollama")

cat > "$PLIST_PATH" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.ollama.server</string>
  <key>ProgramArguments</key>
  <array>
    <string>${OLLAMA_PATH}</string>
    <string>serve</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>OLLAMA_HOST</key>
    <string>0.0.0.0</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardErrorPath</key>
  <string>/tmp/ollama.log</string>
  <key>StandardOutPath</key>
  <string>/tmp/ollama.log</string>
</dict>
</plist>
PLIST

echo "Created launchd plist at $PLIST_PATH"

# Load it (unload first if already loaded)
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"
echo "Ollama launchd agent loaded"

# 3. Wait for Ollama to start
echo "Waiting for Ollama to start..."
sleep 5

# 4. Verify
if curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "Ollama is running"
  curl -s http://localhost:11434/api/tags | python3 -c "
import sys, json
d = json.load(sys.stdin)
models = [m['name'] for m in d.get('models', [])]
print(f'Models available: {models}')
"
else
  echo "WARNING: Ollama not responding yet. Check /tmp/ollama.log"
fi

# 5. Pull model if needed
echo ""
echo "Pulling llama3.2 model (skip if already present)..."
ollama pull llama3.2

echo ""
echo "═══════════════════════════════════"
echo "Setup complete!"
echo ""
echo "Ollama: http://100.93.179.28:11434"
echo "Auto-starts on boot: YES"
echo "Model: llama3.2"
echo ""
echo "Test from anywhere via Tailscale:"
echo "  curl http://100.93.179.28:11434/api/generate \\"
echo "    -d '{\"model\":\"llama3.2\",\"prompt\":\"Say hello\",\"stream\":false}'"
echo "═══════════════════════════════════"
