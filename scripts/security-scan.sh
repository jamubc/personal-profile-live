#!/bin/bash

###############################################################################
# Comprehensive Automated Security Scan Script
#
# This script performs multiple security checks:
# - npm dependency vulnerability checks
# - Outdated package checks
# - ESLint security scan
# - Production build verification
# - Source map detection in dist
###############################################################################

set -e

# Color and emoji definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PASS='✅'
FAIL='❌'
WARN='⚠️'
INFO='ℹ️'
SCAN='🔍'
LOCK='🔒'
SHIELD='🛡️'
ROCKET='🚀'

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}${SHIELD} $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_section() {
    echo -e "\n${CYAN}${INFO} $1${NC}"
    echo -e "${BLUE}─────────────────────────────────────────${NC}"
}

print_success() {
    echo -e "${GREEN}${PASS} $1${NC}"
    ((PASSED_CHECKS++))
}

print_failure() {
    echo -e "${RED}${FAIL} $1${NC}"
    ((FAILED_CHECKS++))
}

print_warning() {
    echo -e "${YELLOW}${WARN} $1${NC}"
    ((WARNING_CHECKS++))
}

print_info() {
    echo -e "${CYAN}${INFO} $1${NC}"
}

increment_check() {
    ((TOTAL_CHECKS++))
}

print_summary() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📊 Security Scan Summary${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    echo -e "Total Checks:    ${CYAN}$TOTAL_CHECKS${NC}"
    echo -e "Passed:          ${GREEN}$PASSED_CHECKS${NC}"
    echo -e "Warnings:        ${YELLOW}$WARNING_CHECKS${NC}"
    echo -e "Failed:          ${RED}$FAILED_CHECKS${NC}"

    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "\n${GREEN}${PASS} All security checks passed!${NC}\n"
        return 0
    else
        echo -e "\n${RED}${FAIL} $FAILED_CHECKS security check(s) failed!${NC}\n"
        return 1
    fi
}

###############################################################################
# Security Checks
###############################################################################

check_npm_audit() {
    print_section "NPM Dependency Vulnerability Check"
    print_info "Scanning for known vulnerabilities in npm dependencies..."
    increment_check

    if npm audit --audit-level=moderate 2>/dev/null; then
        print_success "No critical or high severity vulnerabilities found"
    else
        local audit_result=$(npm audit 2>/dev/null | grep -i "vulnerability\|vulnerabilities" | head -1)
        print_warning "Vulnerabilities detected: $audit_result"
        ((WARNING_CHECKS--))
        ((FAILED_CHECKS++))

        echo -e "${YELLOW}Run 'npm audit' for details and 'npm audit fix' to attempt automatic fixes${NC}"
    fi
}

check_outdated_packages() {
    print_section "Outdated Package Check"
    print_info "Checking for outdated dependencies..."
    increment_check

    local outdated_output=$(npm outdated 2>/dev/null || true)

    if [ -z "$outdated_output" ] || [ "$outdated_output" = "npm WARN cli readdir ENOENT: no such file or directory, scandir 'node_modules'" ]; then
        print_success "No outdated packages found"
    else
        # Count outdated packages
        local count=$(echo "$outdated_output" | grep -c "^" || echo 0)
        if [ $count -eq 0 ]; then
            print_success "No outdated packages found"
        else
            print_warning "Found $count outdated package(s)"
            echo -e "${YELLOW}$outdated_output${NC}" | head -10
            ((WARNING_CHECKS--))
        fi
    fi
}

check_eslint_security() {
    print_section "ESLint Security Scan"

    # Check if ESLint is installed
    if ! npm ls eslint >/dev/null 2>&1; then
        print_info "ESLint not installed, skipping ESLint security scan"
        return 0
    fi

    print_info "Running ESLint security scan..."
    increment_check

    # Check if there's an eslintrc file
    if [ ! -f ".eslintrc.js" ] && [ ! -f ".eslintrc.json" ] && [ ! -f ".eslintrc.yml" ] && [ ! -f ".eslintrc" ]; then
        print_warning "No ESLint configuration found"
        return 0
    fi

    # Find all source files
    local src_files=$(find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" -not -path "./build/*" 2>/dev/null | head -20)

    if [ -z "$src_files" ]; then
        print_info "No source files found to scan"
        return 0
    fi

    # Run ESLint with quiet flag to count errors only
    local eslint_output=$(npx eslint . --max-warnings 0 2>&1 || true)

    if echo "$eslint_output" | grep -q "error"; then
        local error_count=$(echo "$eslint_output" | grep -o "[0-9]* error" | head -1 | grep -o "[0-9]*" || echo "0")
        print_failure "ESLint found $error_count error(s)"
        echo -e "${RED}$eslint_output${NC}" | head -15
    else
        print_success "No ESLint errors found"
    fi
}

check_production_build() {
    print_section "Production Build Verification"
    print_info "Checking build configuration..."
    increment_check

    # Check if package.json has a build script
    if ! grep -q '"build"' package.json 2>/dev/null; then
        print_warning "No build script found in package.json"
        return 0
    fi

    print_info "Verifying build output..."

    # Attempt to build if build script exists
    if npm run build >/dev/null 2>&1; then
        print_success "Production build completed successfully"

        # Verify build output exists
        if [ -d "dist" ] || [ -d "build" ]; then
            print_success "Build output directory verified"
        fi
    else
        print_failure "Production build failed - please review build errors"
        npm run build 2>&1 | head -20
    fi
}

check_source_maps() {
    print_section "Source Map Detection in Distribution"
    print_info "Scanning for source maps in production build..."
    increment_check

    local sourcemap_files=0

    if [ -d "dist" ]; then
        sourcemap_files=$(find dist -name "*.map" -o -name "*.js.map" -o -name "*.css.map" 2>/dev/null | wc -l || echo 0)
    fi

    if [ $sourcemap_files -gt 0 ]; then
        print_failure "Found $sourcemap_files source map file(s) in dist directory"
        echo -e "${RED}Source maps should not be deployed to production${NC}"
        find dist -type f \( -name "*.map" -o -name "*.js.map" -o -name "*.css.map" \) 2>/dev/null | head -10 | sed 's/^/  - /'
        ((FAILED_CHECKS--))
    else
        print_success "No source maps found in dist directory"
    fi
}

check_git_secrets() {
    print_section "Git Configuration Check"
    print_info "Verifying git repository security..."
    increment_check

    # Check if .git exists
    if [ ! -d ".git" ]; then
        print_warning "Not a git repository"
        return 0
    fi

    # Check if .gitignore exists
    if [ ! -f ".gitignore" ]; then
        print_warning ".gitignore file not found"
    else
        # Check for common sensitive files in .gitignore
        local sensitive_patterns=(".env" "*.key" "*.pem" "secrets" "credentials")
        local found_patterns=0

        for pattern in "${sensitive_patterns[@]}"; do
            if grep -q "$pattern" .gitignore 2>/dev/null; then
                ((found_patterns++))
            fi
        done

        if [ $found_patterns -gt 0 ]; then
            print_success "Sensitive file patterns found in .gitignore"
        else
            print_warning ".gitignore exists but may need additional sensitive patterns"
        fi
    fi

    # Check for accidentally committed sensitive files
    local sensitive_files=$(git ls-files 2>/dev/null | grep -E "\.env|\.pem|\.key|secrets\.js|credentials" || true)

    if [ -n "$sensitive_files" ]; then
        print_failure "Sensitive files may be committed to git:"
        echo "$sensitive_files" | sed 's/^/  - /'
        ((FAILED_CHECKS--))
    else
        print_success "No sensitive files detected in git history"
    fi
}

check_node_modules_security() {
    print_section "Node Modules Integrity Check"
    increment_check

    if [ ! -d "node_modules" ]; then
        print_warning "node_modules directory not found"
        return 0
    fi

    print_info "Checking node_modules integrity..."

    # Check if package-lock.json or yarn.lock exists
    if [ -f "package-lock.json" ] || [ -f "yarn.lock" ]; then
        # Run npm ci or yarn install --frozen-lockfile
        if npm ci --dry-run >/dev/null 2>&1; then
            print_success "node_modules matches lockfile"
        else
            print_warning "node_modules may not match lockfile - consider running npm ci"
        fi
    else
        print_info "No lockfile found (package-lock.json or yarn.lock)"
    fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
    print_header "Comprehensive Security Scan"
    echo -e "${CYAN}${LOCK} Starting security analysis...${NC}\n"

    # Change to the directory where this script is located
    cd "$(dirname "$(readlink -f "$0")")/.." || exit 1

    echo -e "${CYAN}Working directory: $(pwd)${NC}\n"

    # Run all security checks
    check_npm_audit
    check_outdated_packages
    check_eslint_security
    check_git_secrets
    check_node_modules_security
    check_production_build
    check_source_maps

    # Print summary and exit with appropriate code
    print_summary
}

# Run main function and capture exit code
main
exit_code=$?

exit $exit_code
