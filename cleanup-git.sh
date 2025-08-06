#!/bin/bash

# Git Repository Cleanup Script
# 이 스크립트는 Git 저장소에서 불필요한 파일들을 제거하고 최적화합니다.

echo "🚀 Git 저장소 정리 시작..."

# 1. 현재 상태 확인
echo "📊 현재 저장소 상태 확인..."
echo "저장소 크기:"
du -sh .git/

echo "가장 큰 파일들:"
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10

# 2. node_modules 제거 (이미 .gitignore에 추가된 경우)
echo "🗑️ node_modules 제거..."
if [ -d "node_modules" ]; then
    echo "node_modules 디렉토리가 발견되었습니다."
    echo "이 디렉토리를 Git에서 제거하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git rm -r --cached node_modules
        echo "node_modules가 Git에서 제거되었습니다."
    fi
fi

# 3. 캐시된 파일들 정리
echo "🧹 Git 캐시 정리..."
git gc --prune=now --aggressive

# 4. 불필요한 파일들 제거
echo "🗑️ 불필요한 파일들 제거..."

# .DS_Store 파일들 제거
find . -name ".DS_Store" -type f -delete
echo "✅ .DS_Store 파일들 제거됨"

# 임시 파일들 제거
find . -name "*.tmp" -type f -delete
find . -name "*.temp" -type f -delete
find . -name "*~" -type f -delete
echo "✅ 임시 파일들 제거됨"

# 5. 로그 파일들 정리
echo "📝 로그 파일들 정리..."
find . -name "*.log" -type f -delete
echo "✅ 로그 파일들 제거됨"

# 6. IDE 설정 파일들 정리 (선택적)
echo "💻 IDE 설정 파일들 정리..."
if [ -d ".vscode" ]; then
    echo ".vscode 디렉토리가 발견되었습니다. 제거하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf .vscode
        echo "✅ .vscode 디렉토리 제거됨"
    fi
fi

if [ -d ".idea" ]; then
    echo ".idea 디렉토리가 발견되었습니다. 제거하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf .idea
        echo "✅ .idea 디렉토리 제거됨"
    fi
fi

# 7. Git 히스토리 최적화
echo "⚡ Git 히스토리 최적화..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 8. 최종 상태 확인
echo "📊 정리 후 저장소 상태 확인..."
echo "저장소 크기:"
du -sh .git/

echo "가장 큰 파일들:"
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10

# 9. 권장사항
echo ""
echo "🎯 추가 권장사항:"
echo "1. .gitignore 파일이 제대로 설정되어 있는지 확인하세요"
echo "2. 큰 파일들은 Git LFS를 사용하는 것을 고려하세요"
echo "3. 정기적으로 이 스크립트를 실행하여 저장소를 깨끗하게 유지하세요"
echo "4. 팀원들과 .gitignore 설정을 공유하세요"

echo ""
echo "✅ Git 저장소 정리 완료!"
echo "변경사항을 커밋하려면:"
echo "git add ."
echo "git commit -m 'Repository cleanup and optimization'" 