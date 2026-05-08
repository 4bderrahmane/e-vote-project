#!/usr/bin/env bash
# Firewall acceptance tests — run from the Fedora client.
set -u

FW="192.168.100.1"
PASS=0
FAIL=0
RESULTS=()

check() {
    local desc="$1"
    local expected="$2"
    local cmd="$3"
    local result
    if eval "$cmd" >/dev/null 2>&1; then
        result="pass"
    else
        result="fail"
    fi
    if [[ "$result" == "$expected" ]]; then
        printf "  \e[32m✓\e[0m %s\n" "$desc"
        PASS=$((PASS+1))
        RESULTS+=("PASS: $desc")
    else
        printf "  \e[31m✗\e[0m %s (expected %s, got %s)\n" "$desc" "$expected" "$result"
        FAIL=$((FAIL+1))
        RESULTS+=("FAIL: $desc (expected $expected, got $result)")
    fi
}

section() {
    printf "\n\e[1m=== %s ===\e[0m\n" "$1"
}

section "Layer 3 connectivity"
check "Ping firewall LAN interface"           "pass" "ping -c 1 -W 2 $FW"
check "Ping internet through firewall (NAT)"  "pass" "ping -c 1 -W 2 8.8.8.8"
check "Ping by hostname (DNS works)"          "pass" "ping -c 1 -W 2 example.com"

section "Layer 7 outbound (FORWARD + masquerade)"
check "DNS resolution"                         "pass" "getent hosts example.com"
check "HTTP through firewall"                  "pass" "curl -fsS -m 5 http://example.com -o /dev/null"
check "HTTPS through firewall"                 "pass" "curl -fsS -m 5 https://example.com -o /dev/null"

section "INPUT chain — what's exposed on the firewall"
check "SSH port open"                          "pass" "nc -zv -w 2 $FW 22"
check "Random high port closed (12345)"        "fail" "nc -zv -w 2 $FW 12345"
check "Telnet not exposed (23)"                "fail" "nc -zv -w 2 $FW 23"
check "HTTP not exposed on firewall (80)"      "fail" "nc -zv -w 2 $FW 80"
check "HTTPS not exposed on firewall (443)"    "fail" "nc -zv -w 2 $FW 443"
check "SMB not exposed (445)"                  "fail" "nc -zv -w 2 $FW 445"

section "Anti-scan defenses"
check "nmap finds only port 22 open"           "pass" \
  "[ \$(nmap -sS -Pn -p 1-1024 --max-retries 1 --host-timeout 30s $FW 2>/dev/null | grep -c '^22/tcp.*open') -eq 1 ]"

section "DNAT (LAN-side, port 8080 → client:80)"
check "DNAT redirects firewall:8080 to client:80" "pass" \
  "curl -fsS -m 5 http://$FW:8080/ -o /dev/null"

section "Summary"
printf "Passed: \e[32m%d\e[0m\n" $PASS
printf "Failed: \e[31m%d\e[0m\n" $FAIL
printf "Total:  %d\n" $((PASS+FAIL))

LOGFILE="$HOME/fw-test-$(date +%Y%m%d-%H%M%S).log"
{
    echo "Firewall test run: $(date)"
    echo "Target: $FW"
    echo "From:   $(hostname) ($(hostname -I | awk '{print $1}'))"
    echo ""
    printf '%s\n' "${RESULTS[@]}"
    echo ""
    echo "Passed: $PASS"
    echo "Failed: $FAIL"
} > "$LOGFILE"
echo ""
echo "Detailed log: $LOGFILE"

exit $((FAIL > 0))
