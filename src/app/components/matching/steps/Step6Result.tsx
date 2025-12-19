import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import { 
  ChevronRight, 
  Download, 
  Share2, 
  Star, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Phone,
  ArrowRight,
  Sparkles,
  BarChart3,
  UserCheck,
  Crown
} from 'lucide-react';
import { Button } from "../ui/button";
import { ReviewModal } from '../../components/result/ReviewModal';

// Slider CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// ------------------- Types -------------------
interface UserData {
  name: string;
  phone: string;
  age: string;
  selectedTags: string[];
  hasContouringExp: boolean | null;
  priority: string;
}

interface Step6ResultProps {
  userData: UserData;
}

interface ReviewData {
  id: number;
  name: string;
  age: string;
  tags: string[];
  beforeImg: string;
  afterImg: string;
  content: string;
  date: string;
}

// ------------------- Mock Data -------------------
const MOCK_REVIEWS: ReviewData[] = [
  {
    id: 1,
    name: "김*지",
    age: "20대",
    tags: ["이중턱", "팔자주름", "윤곽주사"],
    beforeImg: "https://images.unsplash.com/photo-1595152452543-e5cca283f541?auto=format&fit=crop&q=80&w=500",
    afterImg: "https://images.unsplash.com/photo-1624091844772-554661d10173?auto=format&fit=crop&q=80&w=500",
    content: "처음에는 반신반의했는데 상담 받고 나서 확신이 들었어요. 특히 제 얼굴형에 맞는 분석이 정말 디테일해서 좋았습니다. 시술 후 2주차인데 라인이 확실히 달라졌어요!",
    date: "2023.10.15"
  },
  {
    id: 2,
    name: "이*영",
    age: "30대",
    tags: ["심부볼", "탄력", "리프팅"],
    beforeImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500",
    afterImg: "https://images.unsplash.com/photo-1595959183082-7bce142cf752?auto=format&fit=crop&q=80&w=500",
    content: "30대가 되면서 처짐이 고민이었는데, 정확히 짚어주셔서 놀랐습니다. 추천해주신 프로그램대로 진행했고 결과는 대만족입니다.",
    date: "2023.11.02"
  },
  {
    id: 3,
    name: "박*수",
    age: "20대",
    tags: ["사각턱", "보톡스", "윤곽"],
    beforeImg: "https://images.unsplash.com/photo-1588514304024-c700b72c9129?auto=format&fit=crop&q=80&w=500",
    afterImg: "https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&q=80&w=500",
    content: "다른 병원 많이 다녀봤지만 여기만큼 꼼꼼하게 분석해주는 곳은 처음이에요. AI 분석 결과가 실제 상담 내용이랑 거의 비슷해서 신기했어요.",
    date: "2023.11.20"
  }
];

// ------------------- Main Component -------------------
export const Step6Result: React.FC<Step6ResultProps> = ({ userData }) => {
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulation of "Analysis" loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (review: ReviewData) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Slider Settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "20px",
    arrows: false,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F0D09] text-[#D4B86A]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Sparkles className="w-16 h-16 text-[#D4B86A]" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="mt-6 text-xl font-light tracking-widest"
        >
          ANALYZING...
        </motion.p>
        <p className="mt-2 text-xs text-[#D4B86A]/50">{userData.name}님의 데이터를 분석중입니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0D09] text-white font-sans selection:bg-[#D4B86A]/30 relative overflow-hidden">
      {/* Background Gradient Spotlights */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#4A3C1A]/40 via-[#6B5A2F]/20 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[#D4B86A]/10 blur-[100px] pointer-events-none" />
      
      {/* 1. Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0D09]/80 backdrop-blur-md border-b border-[#D4B86A]/10 h-14 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#D4B86A]" />
          <span className="font-bold text-lg text-[#F5D88E] tracking-tight">BALANCE LAB</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#D4B86A]/10 flex items-center justify-center border border-[#D4B86A]/30">
          <UserCheck className="w-4 h-4 text-[#D4B86A]" />
        </div>
      </header>

      <div className="pt-14 pb-32">
        
        {/* 2. User Info */}
        <section className="px-6 pt-8 pb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4B86A]/10 border border-[#D4B86A]/20 text-[#D4B86A] text-xs font-medium mb-2">
              <CheckCircle2 className="w-3 h-3" />
              <span>분석 완료</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D88E] via-[#D4B86A] to-[#C9A962]">
                {userData.name}님
              </span>의<br/>
              맞춤 분석 결과
            </h1>
            <p className="text-gray-400 text-sm">
              AI가 <span className="text-[#D4B86A] font-bold">1,240건</span>의 유사 케이스를 찾았습니다.
            </p>
          </motion.div>
        </section>

        {/* 3. Hero Section (Images) */}
        <section className="px-5 mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative grid grid-cols-3 gap-2 h-48"
          >
             {/* Left Image */}
            <div className="relative rounded-l-2xl overflow-hidden border-y border-l border-[#D4B86A]/30">
               <img src="https://images.unsplash.com/photo-1595152452543-e5cca283f541?auto=format&fit=crop&q=80&w=300" alt="Before" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" />
               <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-300 font-medium">Before</div>
            </div>
             {/* Center Image (Main) */}
            <div className="relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(212,184,106,0.3)] border border-[#D4B86A] z-10 transform scale-110">
               <img src="https://images.unsplash.com/photo-1624091844772-554661d10173?auto=format&fit=crop&q=80&w=400" alt="Result" className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 bg-[#D4B86A] text-[#3D2E0F] text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                 98% 매칭
               </div>
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                 <p className="text-white text-xs font-bold text-center">예상 결과</p>
               </div>
            </div>
             {/* Right Image */}
            <div className="relative rounded-r-2xl overflow-hidden border-y border-r border-[#D4B86A]/30">
               <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=300" alt="After" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" />
               <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-gray-300 font-medium">After</div>
            </div>
          </motion.div>
        </section>

        {/* 4. Info Cards */}
        <section className="px-5 mb-10">
          <div className="grid grid-cols-1 gap-4">
            {/* Analysis Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#2A2415] to-[#1A160F] p-5 rounded-2xl border border-[#D4B86A]/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4B86A]/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-[#D4B86A]/10"></div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#D4B86A]/10 rounded-lg text-[#D4B86A]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#F5D88E]">AI 분석 요약</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="text-white font-semibold">{userData.age}</span>의 평균 데이터와 비교했을 때, 
                <span className="text-[#D4B86A]"> {userData.selectedTags[0]}</span> 관련 고민도가 
                상위 <span className="text-[#D4B86A]">15%</span>에 해당합니다. 
                집중적인 관리가 필요한 시점입니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {/* Matching Point */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1C1914] p-4 rounded-2xl border border-[#D4B86A]/10"
              >
                 <div className="text-[#D4B86A] mb-2"><Sparkles className="w-5 h-5" /></div>
                 <h4 className="text-xs text-gray-400 mb-1">매칭 포인트</h4>
                 <p className="font-bold text-sm text-white">{userData.selectedTags[0] || '탄력'} 개선</p>
                 <p className="text-xs text-gray-500 mt-1">자연스러운 라인</p>
              </motion.div>

              {/* Expectation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#1C1914] p-4 rounded-2xl border border-[#D4B86A]/10"
              >
                 <div className="text-[#D4B86A] mb-2"><TrendingUpIcon /></div>
                 <h4 className="text-xs text-gray-400 mb-1">기대 효과</h4>
                 <p className="font-bold text-sm text-white">윤곽 라인 정리</p>
                 <p className="text-xs text-gray-500 mt-1">입체감 20% 향상</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. CTA Button */}
        <section className="px-5 mb-12">
          <Button className="w-full h-14 bg-gradient-to-r from-[#D4B86A] via-[#F5D88E] to-[#D4B86A] text-[#3D2E0F] font-bold text-lg rounded-xl shadow-[0_8px_32px_rgba(212,184,106,0.3)] hover:opacity-90 hover:scale-[1.02] transition-all duration-300 animate-pulse">
            <Phone className="w-5 h-5 mr-2" />
            무료 상담 신청하기
          </Button>
          <p className="text-center text-[10px] text-gray-500 mt-3">
            *상담 신청 시 대기 없이 우선 배정됩니다.
          </p>
        </section>

        {/* 6. Keywords */}
        <section className="px-5 mb-12">
          <h3 className="text-lg font-bold text-white mb-4 px-1">분석 키워드</h3>
          <div className="flex flex-wrap gap-2">
            {userData.selectedTags.map((tag, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-[#2A2415] border border-[#D4B86A]/20 text-[#D4B86A] text-sm">
                #{tag}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-lg bg-[#2A2415] border border-[#D4B86A]/20 text-[#D4B86A] text-sm">#{userData.age}</span>
            {userData.hasContouringExp && (
              <span className="px-3 py-1.5 rounded-lg bg-[#2A2415] border border-[#D4B86A]/20 text-[#D4B86A] text-sm">#경험있음</span>
            )}
            <span className="px-3 py-1.5 rounded-lg bg-[#2A2415] border border-[#D4B86A]/20 text-[#D4B86A] text-sm">#{userData.priority}</span>
          </div>
        </section>

        {/* 7. Review Slider */}
        <section className="mb-12 overflow-hidden">
          <div className="flex justify-between items-end px-6 mb-5">
             <h3 className="text-lg font-bold text-white">
               유사 사례 후기
               <span className="block text-xs text-[#D4B86A] font-normal mt-1">매칭률 90% 이상 케이스</span>
             </h3>
             <div className="flex gap-1">
               {/* Arrows could go here */}
             </div>
          </div>
          
          <div className="pb-5">
            <Slider {...sliderSettings}>
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="px-2 outline-none" onClick={() => openModal(review)}>
                   <div className="bg-[#1C1914] rounded-2xl border border-[#D4B86A]/10 overflow-hidden cursor-pointer group hover:border-[#D4B86A]/40 transition-colors">
                      <div className="relative h-40">
                         <img src={review.afterImg} className="w-full h-full object-cover" alt="Review" />
                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                           <div className="flex justify-between items-end">
                             <div className="text-white text-sm font-bold">{review.name}</div>
                             <div className="flex text-[#D4B86A]">
                               {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                             </div>
                           </div>
                         </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-400 line-clamp-2">{review.content}</p>
                        <div className="mt-3 flex gap-1 flex-wrap">
                          {review.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-[10px] bg-[#2A2415] text-[#D4B86A] px-1.5 py-0.5 rounded border border-[#D4B86A]/10">#{t}</span>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* 8. Progress Timeline */}
        <section className="px-5 mb-12">
          <h3 className="text-lg font-bold text-white mb-6 px-1">진행 과정 안내</h3>
          <div className="relative pl-4 border-l border-[#D4B86A]/20 space-y-8 ml-2">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#D4B86A] shadow-[0_0_10px_#D4B86A]"></div>
              <div className="pl-4">
                 <h4 className="text-[#D4B86A] font-bold text-sm">접수 완료</h4>
                 <p className="text-xs text-gray-400 mt-1">고객님의 분석 데이터가 접수되었습니다.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#2A2415] border border-[#D4B86A]"></div>
              <div className="pl-4">
                 <h4 className="text-white font-bold text-sm">전담 실장 배정중</h4>
                 <p className="text-xs text-gray-400 mt-1">가장 적합한 전문가를 매칭하고 있습니다.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-[#2A2415] border border-[#D4B86A]/30"></div>
              <div className="pl-4 opacity-50">
                 <h4 className="text-white font-bold text-sm">해피콜 진행</h4>
                 <p className="text-xs text-gray-400 mt-1">유선으로 상세 상담을 도와드립니다.</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* 9. Bottom Fixed Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F0D09]/95 backdrop-blur border-t border-[#D4B86A]/20 p-5 pb-8 z-40">
         {/* Coupon */}
         <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-[90%] bg-gradient-to-r from-[#D4B86A] to-[#F5D88E] rounded-t-lg p-1.5 text-center shadow-[0_-5px_20px_rgba(212,184,106,0.2)]">
            <span className="text-[#3D2E0F] text-xs font-bold flex items-center justify-center gap-2">
              <Crown className="w-3 h-3" />
              AI 정밀 진단 무료권 포함
            </span>
         </div>
         
         <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-[#D4B86A]/50 text-[#D4B86A] hover:bg-[#D4B86A]/10 bg-transparent h-12">
              처음으로
            </Button>
            <Button className="flex-[2] bg-[#D4B86A] hover:bg-[#C9A962] text-[#3D2E0F] font-bold h-12">
              지금 바로 연결하기
            </Button>
         </div>
      </div>

      {/* Modal */}
      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        review={selectedReview} 
      />

    </div>
  );
};

// Helper Icon for styling
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);
