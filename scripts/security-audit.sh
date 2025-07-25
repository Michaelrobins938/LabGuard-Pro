#!/bin/bash

# LabGuard Pro Security Audit Script
# This script performs comprehensive security checks on the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
AUDIT_DIR="/tmp/security-audit-$(date +%Y%m%d_%H%M%S)"
REPORT_FILE="$AUDIT_DIR/security-report.txt"
VULNERABILITIES_FILE="$AUDIT_DIR/vulnerabilities.txt"
RECOMMENDATIONS_FILE="$AUDIT_DIR/recommendations.txt"

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Initialize audit
init_audit() {
    log "Initializing security audit..."
    mkdir -p "$AUDIT_DIR"
    
    echo "LabGuard Pro Security Audit Report" > "$REPORT_FILE"
    echo "Generated: $(date)" >> "$REPORT_FILE"
    echo "==================================" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    
    echo "Vulnerabilities Found:" > "$VULNERABILITIES_FILE"
    echo "=====================" >> "$VULNERABILITIES_FILE"
    echo "" >> "$VULNERABILITIES_FILE"
    
    echo "Security Recommendations:" > "$RECOMMENDATIONS_FILE"
    echo "========================" >> "$RECOMMENDATIONS_FILE"
    echo "" >> "$RECOMMENDATIONS_FILE"
}

# Check dependencies for vulnerabilities
check_dependencies() {
    log "Checking dependencies for vulnerabilities..."
    
    echo "## Dependency Security Check" >> "$REPORT_FILE"
    
    # Check npm audit
    if command -v npm &> /dev/null; then
        info "Running npm audit..."
        npm audit --audit-level=moderate > "$AUDIT_DIR/npm-audit.txt" 2>&1 || true
        
        if grep -q "found" "$AUDIT_DIR/npm-audit.txt"; then
            warn "NPM vulnerabilities found"
            echo "NPM vulnerabilities found:" >> "$VULNERABILITIES_FILE"
            cat "$AUDIT_DIR/npm-audit.txt" >> "$VULNERABILITIES_FILE"
            echo "" >> "$VULNERABILITIES_FILE"
        else
            log "No NPM vulnerabilities found"
        fi
    fi
    
    # Check for known vulnerable packages
    check_vulnerable_packages
}

# Check for known vulnerable packages
check_vulnerable_packages() {
    info "Checking for known vulnerable packages..."
    
    # List of known vulnerable packages to check
    vulnerable_packages=(
        "lodash"
        "moment"
        "axios"
        "express"
        "jsonwebtoken"
    )
    
    for package in "${vulnerable_packages[@]}"; do
        if grep -q "\"$package\"" package*.json; then
            warn "Potentially vulnerable package found: $package"
            echo "Potentially vulnerable package: $package" >> "$VULNERABILITIES_FILE"
        fi
    done
}

# Check environment variables
check_environment() {
    log "Checking environment variables..."
    
    echo "## Environment Variables Check" >> "$REPORT_FILE"
    
    # Check for hardcoded secrets
    if grep -r "password\|secret\|key\|token" .env* 2>/dev/null | grep -v "example\|template"; then
        warn "Potential hardcoded secrets found in environment files"
        echo "Hardcoded secrets in environment files" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for weak JWT secrets
    if grep -q "your-secret\|default-secret\|test-secret" .env* 2>/dev/null; then
        error "Weak JWT secrets detected"
        echo "Weak JWT secrets detected" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for missing environment variables
    required_vars=(
        "JWT_SECRET"
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "STRIPE_SECRET_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env* 2>/dev/null; then
            warn "Missing required environment variable: $var"
            echo "Missing environment variable: $var" >> "$VULNERABILITIES_FILE"
        fi
    done
}

# Check Docker security
check_docker_security() {
    log "Checking Docker security..."
    
    echo "## Docker Security Check" >> "$REPORT_FILE"
    
    # Check for running containers as root
    if docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | grep -q "root"; then
        warn "Containers running as root detected"
        echo "Containers running as root" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for exposed ports
    if docker ps --format "{{.Ports}}" | grep -q ":80\|:443\|:3000\|:3001"; then
        info "Exposed ports detected (this may be expected for web services)"
    fi
    
    # Check for privileged containers
    if docker ps --format "{{.Names}}" | xargs -I {} docker inspect {} | grep -q '"Privileged": true'; then
        error "Privileged containers detected"
        echo "Privileged containers detected" >> "$VULNERABILITIES_FILE"
    fi
}

# Check file permissions
check_file_permissions() {
    log "Checking file permissions..."
    
    echo "## File Permissions Check" >> "$REPORT_FILE"
    
    # Check for world-writable files
    find . -type f -perm -002 -not -path "./node_modules/*" -not -path "./.git/*" > "$AUDIT_DIR/world-writable.txt"
    
    if [ -s "$AUDIT_DIR/world-writable.txt" ]; then
        warn "World-writable files found"
        echo "World-writable files:" >> "$VULNERABILITIES_FILE"
        cat "$AUDIT_DIR/world-writable.txt" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for sensitive files with wrong permissions
    sensitive_files=(
        ".env*"
        "*.key"
        "*.pem"
        "*.crt"
    )
    
    for pattern in "${sensitive_files[@]}"; do
        find . -name "$pattern" -perm /022 > "$AUDIT_DIR/sensitive-files.txt" 2>/dev/null || true
        if [ -s "$AUDIT_DIR/sensitive-files.txt" ]; then
            warn "Sensitive files with loose permissions found"
            echo "Sensitive files with loose permissions:" >> "$VULNERABILITIES_FILE"
            cat "$AUDIT_DIR/sensitive-files.txt" >> "$VULNERABILITIES_FILE"
        fi
    done
}

# Check code security
check_code_security() {
    log "Checking code security..."
    
    echo "## Code Security Check" >> "$REPORT_FILE"
    
    # Check for SQL injection patterns
    if grep -r "query.*\+.*req\." apps/ backend/ 2>/dev/null | grep -v "test\|example"; then
        warn "Potential SQL injection patterns found"
        echo "Potential SQL injection patterns" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for XSS patterns
    if grep -r "innerHTML\|dangerouslySetInnerHTML" apps/web/src/ 2>/dev/null | grep -v "test\|example"; then
        warn "Potential XSS patterns found"
        echo "Potential XSS patterns" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for hardcoded credentials
    if grep -r "password.*=.*['\"].*['\"]" apps/ backend/ 2>/dev/null | grep -v "test\|example\|TODO"; then
        warn "Hardcoded credentials found"
        echo "Hardcoded credentials found" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for console.log statements in production code
    if grep -r "console\.log" apps/web/src/ apps/api/src/ backend/src/ 2>/dev/null | grep -v "test\|example"; then
        warn "Console.log statements found in production code"
        echo "Console.log statements in production code" >> "$VULNERABILITIES_FILE"
    fi
}

# Check network security
check_network_security() {
    log "Checking network security..."
    
    echo "## Network Security Check" >> "$REPORT_FILE"
    
    # Check for open ports
    netstat -tuln > "$AUDIT_DIR/open-ports.txt" 2>/dev/null || ss -tuln > "$AUDIT_DIR/open-ports.txt" 2>/dev/null || true
    
    # Check for HTTPS configuration
    if ! grep -q "https\|ssl\|tls" nginx/nginx.conf 2>/dev/null; then
        warn "HTTPS not configured in nginx"
        echo "HTTPS not configured" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for security headers
    if ! grep -q "X-Frame-Options\|X-Content-Type-Options\|X-XSS-Protection" nginx/nginx.conf 2>/dev/null; then
        warn "Security headers not configured"
        echo "Security headers not configured" >> "$VULNERABILITIES_FILE"
    fi
}

# Check database security
check_database_security() {
    log "Checking database security..."
    
    echo "## Database Security Check" >> "$REPORT_FILE"
    
    # Check for weak database passwords
    if grep -q "password\|123\|admin\|test" .env* 2>/dev/null | grep DATABASE_URL; then
        warn "Weak database password detected"
        echo "Weak database password" >> "$VULNERABILITIES_FILE"
    fi
    
    # Check for database connection security
    if ! grep -q "sslmode=require" .env* 2>/dev/null | grep DATABASE_URL; then
        warn "Database SSL not enforced"
        echo "Database SSL not enforced" >> "$VULNERABILITIES_FILE"
    fi
}

# Generate recommendations
generate_recommendations() {
    log "Generating security recommendations..."
    
    echo "## General Security Recommendations" >> "$RECOMMENDATIONS_FILE"
    echo "1. Enable HTTPS for all communications" >> "$RECOMMENDATIONS_FILE"
    echo "2. Implement proper CORS policies" >> "$RECOMMENDATIONS_FILE"
    echo "3. Use strong, unique passwords for all services" >> "$RECOMMENDATIONS_FILE"
    echo "4. Enable two-factor authentication for admin accounts" >> "$RECOMMENDATIONS_FILE"
    echo "5. Regularly update dependencies" >> "$RECOMMENDATIONS_FILE"
    echo "6. Implement rate limiting on all API endpoints" >> "$RECOMMENDATIONS_FILE"
    echo "7. Enable audit logging for all sensitive operations" >> "$RECOMMENDATIONS_FILE"
    echo "8. Use environment variables for all secrets" >> "$RECOMMENDATIONS_FILE"
    echo "9. Implement proper input validation and sanitization" >> "$RECOMMENDATIONS_FILE"
    echo "10. Regular security penetration testing" >> "$RECOMMENDATIONS_FILE"
    echo "" >> "$RECOMMENDATIONS_FILE"
    
    echo "## Specific Recommendations" >> "$RECOMMENDATIONS_FILE"
    
    # Add specific recommendations based on findings
    if [ -s "$VULNERABILITIES_FILE" ]; then
        echo "Based on the vulnerabilities found:" >> "$RECOMMENDATIONS_FILE"
        echo "- Address all identified vulnerabilities immediately" >> "$RECOMMENDATIONS_FILE"
        echo "- Review and update security policies" >> "$RECOMMENDATIONS_FILE"
        echo "- Implement automated security scanning in CI/CD" >> "$RECOMMENDATIONS_FILE"
    fi
}

# Generate final report
generate_report() {
    log "Generating final security report..."
    
    # Count vulnerabilities
    vuln_count=$(grep -c "^" "$VULNERABILITIES_FILE" 2>/dev/null || echo "0")
    vuln_count=$((vuln_count - 3)) # Subtract header lines
    
    echo "" >> "$REPORT_FILE"
    echo "## Summary" >> "$REPORT_FILE"
    echo "Total vulnerabilities found: $vuln_count" >> "$REPORT_FILE"
    echo "Report generated: $(date)" >> "$REPORT_FILE"
    echo "Audit directory: $AUDIT_DIR" >> "$REPORT_FILE"
    
    # Append vulnerabilities and recommendations
    echo "" >> "$REPORT_FILE"
    cat "$VULNERABILITIES_FILE" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    cat "$RECOMMENDATIONS_FILE" >> "$REPORT_FILE"
    
    log "Security audit completed. Report saved to: $REPORT_FILE"
    
    if [ $vuln_count -gt 0 ]; then
        warn "Security vulnerabilities found: $vuln_count"
        echo "Please review the report and address all issues."
    else
        log "No security vulnerabilities found!"
    fi
}

# Cleanup function
cleanup() {
    # Keep audit files for review
    info "Audit files preserved in: $AUDIT_DIR"
}

# Main function
main() {
    log "Starting LabGuard Pro security audit..."
    
    init_audit
    check_dependencies
    check_environment
    check_docker_security
    check_file_permissions
    check_code_security
    check_network_security
    check_database_security
    generate_recommendations
    generate_report
    cleanup
    
    log "Security audit completed successfully!"
}

# Run main function
main "$@" 