import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import {
  ChevronRight,
  Share2,
  Download,
  RotateCcw,
  Phone,
  Sparkles,
  ScanLine,
  Activity,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import { ReviewModal } from '../../result/ReviewModal';
import { ReviewData as RawReviewData } from '../../../types';
import { REVIEWS } from '../../../data/reviews';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// 헤더 아이콘/로고
import logoImage from '../../../assets/5986604ddbbbb494de4b65764b340209c23f1260.png';
import homeIcon from '../../../assets/ico_home.png';
import callIcon from '../../../assets/ico_call.png';
import kakaoIcon from '../../../assets/ico_kakao.png';

// --- Types ---

interface Step6ResultProps {
  userData: {
    name: string;
    phone: string;
    age: string;
    selectedTags: string[];
    priority: string;
    hasContouringExp?: boolean | null;
  };
}

// Display용 ReviewData (UI에서 사용)
interface DisplayReview {
  id: number;
  name: string;
  age: string;
  rating: number;
  date: string;
  content: string;
  tags: string[];
  beforeImage: string;
  afterImage: string;
}

type ScoredReview = RawReviewData & {
  score: number;
  isContouringReview: boolean;
};

// --- Utility Functions ---

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// 이미지 경로 추출 함수
function extractImages(content: string): string[] {
  const lines = content.split('\n');
  const images: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if ((trimmed.endsWith('.webp') || trimmed.endsWith('.jpg') || trimmed.endsWith('.png')) &&
      (trimmed.includes('-a-') || trimmed.includes('-b-'))) {
      // public\ 제거하고 / 로 시작하게
      const path = '/' + trimmed.replace(/^public[\\\/]/, '').replace(/\\/g, '/');
      images.push(path);
    }
  }
  return images;
}

// Raw 데이터를 Display용으로 변환
function convertToDisplayReview(review: RawReviewData): DisplayReview {
  const images = extractImages(review.content);
  const beforeImage = images.find(img => img.includes('-b-')) || '/placeholder.jpg';
  const afterImage = images.find(img => img.includes('-a-')) || '/placeholder.jpg';

  return {
    id: review.id,
    name: review.name || `${review.age}대 고객`,
    age: `${review.age}대`,
    rating: 5,
    date: '2024.03',
    content: review.content,
    tags: review.tags,
    beforeImage,
    afterImage,
  };
}

// --- Component ---

export const Step6Result: React.FC<Step6ResultProps> = ({ userData }) => {
  const [selectedReview, setSelectedReview] = useState<DisplayReview | null>(null);
  const [matchScore, setMatchScore] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 매칭 로직 ---
  const matchedReviews = useMemo((): DisplayReview[] => {
    if (!REVIEWS || REVIEWS.length === 0) return [];
    const results = REVIEWS.filter((review): review is RawReviewData => !!review);

    const scoredResults = results.map((review) => {
      let score = 0;
      const isContouringReview = review.memo?.includes('contouring') || false;

      // 윤곽 경험자 우선
      if (userData.hasContouringExp && isContouringReview) score += 1000;

      // 연령대 매칭 (userData.age는 "30대" 형식, review.age는 "30" 형식)
      const userAgeNum = userData.age.replace(/[^0-9]/g, '');
      if (review.age === userAgeNum) score += 100;

      // 태그 매칭
      const tagMatchCount = review.tags.filter((tag) =>
        userData.selectedTags.some(userTag => userTag.includes(tag) || tag.includes(userTag))
      ).length;
      score += tagMatchCount * 10;

      return { ...review, score, isContouringReview };
    });

    const filtered = scoredResults
      .filter(item => {
        if (userData.hasContouringExp && item.isContouringReview) return true;
        const userAgeNum = userData.age.replace(/[^0-9]/g, '');
        if (item.age !== userAgeNum) return false;
        return item.score > 0;
      })
      .sort((a, b) => b.score - a.score);

    // Raw 데이터를 Display용으로 변환
    return filtered.slice(0, 10).map(convertToDisplayReview);
  }, [userData]);

  // 매칭률 계산
  const targetMatchScore = Math.min(98, 90 + Math.floor(matchedReviews.length / 2));

  // Counter animation
  useEffect(() => {
    const target = targetMatchScore;
    const duration = 2000;
    const interval = 20;
    const step = target / (duration / interval);

    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setMatchScore(target);
        clearInterval(timer);
      } else {
        setMatchScore(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetMatchScore]);

  // 키워드 생성
  const analysisKeywords = useMemo(() => {
    const keywords: string[] = [];

    // 1. 나이
    keywords.push(`#${userData.age}`);

    // 2. 선택한 태그 전부 (최대 4개)
    if (userData.selectedTags.length > 0) {
      keywords.push(...userData.selectedTags.slice(0, 4).map(tag => `#${tag}`));
    }

    // 3. 윤곽 경험자
    if (userData.hasContouringExp) {
      keywords.push('#윤곽시술경험');
      keywords.push('#재시술');
    }

    // 4. 우선순위
    if (userData.priority) {
      const priorityText = userData.priority.split(' ')[0];
      keywords.push(`#${priorityText}중시`);
    }

    // 5. 매칭 결과 기반 추가 태그
    if (matchedReviews.length >= 5) {
      keywords.push('#풍부한사례');
    }
    if (matchedReviews.length >= 3) {
      keywords.push('#맞춤분석완료');
    }

    // 6. 기본 태그
    keywords.push('#비절개리프팅');
    keywords.push('#투명브이리프팅');

    return keywords.slice(0, 8); // 최대 8개
  }, [userData, matchedReviews.length]);

  const sliderSettings = {
    dots: true,
    infinite: matchedReviews.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: matchedReviews.length > 1,
    autoplaySpeed: 4000,
    arrows: false,
    variableWidth: true,
    centerMode: true,
    className: "review-slider",
    afterChange: (current: number) => setCurrentSlide(current),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 overflow-x-hidden relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-amber-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <ReviewModal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        review={selectedReview}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10 h-14">
        <div className="max-w-lg mx-auto px-4 h-full flex justify-between items-center relative">
          {/* 홈 아이콘 */}
          <a
            href="https://balancelab.kr/sub/lift09.php"
            className="block hover:opacity-70 transition-opacity z-10"
          >
            <img
              src={homeIcon}
              alt="홈페이지"
              className="w-5 h-5 object-contain brightness-0 invert opacity-70"
            />
          </a>

          {/* 로고 (중앙) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={logoImage}
              alt="밸런스랩"
              className="h-7 w-auto object-contain brightness-0 invert"
            />
          </div>

          {/* 상담 아이콘들 */}
          <div className="flex items-center gap-4 z-10">
            <a
              href="tel:1661-8581"
              className="block hover:opacity-70 transition-opacity"
            >
              <img
                src={callIcon}
                alt="전화 상담"
                className="w-5 h-5 object-contain brightness-0 invert opacity-70"
              />
            </a>
            <a
              href="http://pf.kakao.com/_SSyxmxj/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-70 transition-opacity"
            >
              <img
                src={kakaoIcon}
                alt="카카오톡 상담"
                className="w-5 h-5 object-contain brightness-0 invert opacity-70"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 relative z-10 max-w-lg mx-auto space-y-8">

        {/* User Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono mb-2">
            <ScanLine size={12} />
            AI ANALYSIS COMPLETE
          </div>
          <h1 className="text-2xl font-bold leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              {userData.name}님
            </span>의<br />
            얼굴 분석 결과입니다.
          </h1>
          <p className="text-slate-400 text-sm">
            AI가 {userData.age} {userData.priority} 고민 케이스<br />
            <span className="text-white font-semibold">12,482건</span>을 분석했습니다.
          </p>
        </motion.div>

        {/* Hero Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative p-1 rounded-3xl bg-gradient-to-b from-amber-500/20 to-transparent"
        >
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-[22px] p-8 text-center overflow-hidden">
            {/* Scanning Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent animate-scan pointer-events-none" />

            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-medium mb-1">나와 유사한 사례 매칭률</p>
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                  {matchScore}
                </span>
                <span className="text-2xl font-bold text-amber-500 mb-2">%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${matchScore}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>


              <div className="flex flex-wrap justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-200/80 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-900/50">
                  <Sparkles size={12} />
                  <span>상위 1% 매칭 정확도</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-200/80 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-900/50">
                  <Target size={12} />
                  <span>나와 매칭된 케이스 <strong>{matchedReviews.length}건</strong></span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3 Column Info Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Activity className="text-blue-400" size={20} />, label: "분석 요약", value: "복합형" },
            { icon: <Target className="text-red-400" size={20} />, label: "핵심 포인트", value: userData.priority },
            { icon: <CheckCircle2 className="text-emerald-400" size={20} />, label: "기대 효과", value: "92%" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-800/50 transition-colors"
            >
              <div className="bg-slate-950 p-2 rounded-full border border-white/5 shadow-inner">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <span className="block text-xs text-slate-500">{item.label}</span>
                <span className="block text-sm font-bold text-slate-200">{item.value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Keywords Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {analysisKeywords.map((keyword, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              {keyword}
            </span>
          ))}
        </motion.div>

        {/* Case Review Slider */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full" />
              유사 케이스 매칭 결과
            </h3>
            <span className="text-sm text-slate-400">
              <span className="text-amber-500 font-bold">{currentSlide + 1}</span>
              <span className="mx-1">/</span>
              <span>{matchedReviews.length}</span>
            </span>
          </div>

          <div className="slider-container -mx-4">
            <style>{`
              .slider-container .slick-slide {
                padding: 0 8px;
              }
              .slider-container .slick-track {
                display: flex;
                align-items: stretch;
              }
            `}</style>
            {matchedReviews.length > 0 ? (
              <Slider {...sliderSettings} dots={false}>
                {matchedReviews.map((review) => (
                  <div key={review.id} className="outline-none h-full" style={{ width: 300 }}>
                    <div
                      onClick={() => setSelectedReview(review)}
                      className="cursor-pointer bg-slate-900 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col hover:border-amber-500/50 transition-colors group"
                    >
                      <div className="relative h-48 bg-slate-800 overflow-hidden">
                        <div className="grid grid-cols-2 h-full w-full overflow-hidden">
                          <div className="relative border-r border-black/20 overflow-hidden">
                            <img src={review.beforeImage} alt="Before" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold">BEFORE</div>
                          </div>
                          <div className="relative overflow-hidden">
                            <img src={review.afterImage} alt="After" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-bold">AFTER</div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-bold text-sm">{review.name}</span>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <p className="text-sm text-slate-300 line-clamp-2 mb-3 min-h-[2.5rem]">
                          {review.tags.join(' / ')}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {review.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] px-2 py-1 bg-slate-800 rounded text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center py-10 text-slate-500">
                매칭되는 사례를 찾고 있습니다...
              </div>
            )}
          </div>
        </section>

        {/* Process Timeline */}
        <section className="bg-slate-900/30 border border-white/5 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-6">진행 상황 안내</h3>
          <div className="relative flex justify-between items-center z-0">
            {/* Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />
            <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-amber-500/50 -z-10" />

            {[
              { step: 1, label: "접수완료", active: true },
              { step: 2, label: "분석완료", active: true, current: true },
              { step: 3, label: "상담배정", active: false }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 bg-slate-950 px-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  item.current ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110 animate-pulse" :
                    item.active ? "bg-slate-700 text-slate-300" : "bg-slate-800 text-slate-600"
                )}>
                  {item.active ? <CheckCircle2 size={16} /> : item.step}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  item.current ? "text-amber-500" : "text-slate-500"
                )}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* 안내 멘트 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400 leading-relaxed">
              곧 <span className="text-amber-400 font-medium">전문 상담사</span>가<br />
              매칭 결과를 토대로 <span className="text-white font-medium">먼저 연락</span>드릴 예정이에요.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              ✨ 잠시만 기다려 주세요!
            </p>
          </div>
        </section>

        {/* 진료 안내 */}
        <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded-full" />
            진료 안내
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-1">진료 및 수술 상담</p>
              <p className="text-slate-200 leading-relaxed">
                서울시 강남구 도산대로 109,<br />
                동원빌딩 3~4층 (<span className="text-rose-400">신분당선</span>, <span className="text-orange-400">3호선 신사역</span> 8번 출구 앞)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-400">고객센터</span>
              <a href="tel:1661-8581" className="text-amber-400 font-bold text-lg">1661-8581</a>
            </div>

            <div>
              <p className="text-slate-400 mb-2">진료시간</p>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>평일 (월~금)</span>
                  <span>오전 10:00 - 오후 8:00</span>
                </div>
                <div className="flex justify-between">
                  <span>토요일</span>
                  <span>오전 10:00 - 오후 4:30</span>
                </div>
                <div className="flex justify-between">
                  <span>일요일</span>
                  <span className="text-slate-500">휴진</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-xs text-slate-500 space-y-1">
              <p>🚗 건물 뒤편 주차장 발렛 가능합니다.</p>
              <p>※ 차 종에 따라 주차에 어려움이 있을 수 있습니다.<br />필요시 대표번호로 문의바랍니다.</p>
            </div>
          </div>
        </section>

        {/* 지도 */}
        <section className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-amber-500 rounded-full" />
            오시는 길
          </h3>

          <div className="text-center py-4 space-y-3">
            <div className="text-4xl">📍</div>
            <p className="text-slate-300 text-sm leading-relaxed">
              서울시 강남구 도산대로 109<br />
              동원빌딩 3~4층
            </p>
            <p className="text-slate-500 text-xs">
              <span className="text-rose-400">신분당선</span> · <span className="text-orange-400">3호선 신사역</span> 8번 출구 앞
            </p>
          </div>

          <a
            href="https://map.naver.com/p/entry/place/35827792"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold rounded-xl text-center transition-colors"
          >
            네이버 지도에서 보기
          </a>
        </section>

        {/* Bottom Spacer */}
        <div className="h-12" />
      </main>


    </div>
  );
};
