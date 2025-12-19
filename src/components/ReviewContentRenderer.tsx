import React from 'react';

interface Props {
    content: string;
    darkMode?: boolean; // 다크모드 지원
}

export const ReviewContentRenderer: React.FC<Props> = ({ content, darkMode = true }) => {
    // 0. 줄바꿈이 있는 태그 처리 (태그 내부에서 줄바꿈 시 태그를 닫고 다시 열어줌)
    let preprocessed = content.replace(/<(b|high|orange|blue)>([\s\S]*?)<\/\1>/gi, (match, tag, body) => {
        if (body.match(/\r?\n/)) {
            return `<${tag}>${body.replace(/\r?\n/g, `</${tag}>\n<${tag}>`)}</${tag}>`;
        }
        return match;
    });

    // 1. 태그 제거 및 줄바꿈으로 분리
    const lines = preprocessed
        .replace(/\r/g, '')
        .split('\n');

    const renderedOutput: React.ReactNode[] = [];

    // 다크모드 스타일
    const styles = darkMode ? {
        box: 'inline-block bg-slate-800 text-slate-200 font-bold px-4 py-2 rounded-lg my-4 text-sm md:text-base border border-slate-700',
        title: 'text-lg md:text-xl font-bold text-white mt-8 mb-2 border-b border-slate-700 pb-2 inline-block',
        text: 'text-slate-300 leading-relaxed text-sm md:text-base break-keep',
        high: 'bg-amber-500/30 text-amber-200 px-1 rounded mx-0.5 font-bold',
        orange: 'text-orange-400 font-bold',
        blue: 'text-blue-400 font-bold',
        bold: 'text-white font-black',
        imgContainer: 'my-4 rounded-xl overflow-hidden shadow-md border border-slate-700 relative bg-slate-800',
    } : {
        box: 'inline-block bg-slate-100 text-slate-800 font-bold px-4 py-2 rounded-lg my-4 text-sm md:text-base border border-slate-200',
        title: 'text-lg md:text-xl font-bold text-slate-900 mt-8 mb-2 border-b border-slate-100 pb-2 inline-block',
        text: 'text-slate-600 leading-relaxed text-sm md:text-base break-keep',
        high: 'bg-yellow-200 text-yellow-900 px-1 rounded mx-0.5 font-bold shadow-sm',
        orange: 'text-orange-500 font-bold',
        blue: 'text-blue-600 font-bold',
        bold: 'text-slate-900 font-black',
        imgContainer: 'my-4 rounded-xl overflow-hidden shadow-md border border-slate-100 relative bg-slate-50',
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
            renderedOutput.push(<br key={`br-${index}`} className="hidden md:block" />);
            return;
        }

        // Grid 태그 무시
        if (trimmed.toLowerCase() === '<grid>' || trimmed.toLowerCase() === '</grid>') {
            return;
        }

        // 1. <box>박스 스타일</box>
        if (trimmed.startsWith('<box>') && trimmed.endsWith('</box>')) {
            const text = trimmed.replace(/<\/?box>/g, '');
            renderedOutput.push(
                <div key={`box-${index}`} className={styles.box}>
                    {text}
                </div>
            );
            return;
        }

        // 2. <title>소제목</title>
        if (trimmed.includes('<title>')) {
            const text = trimmed.replace(/<\/?title>/g, '');
            renderedOutput.push(
                <h3 key={`title-${index}`} className={styles.title}>
                    {text}
                </h3>
            );
            return;
        }

        // 이미지 경로 감지
        const isImagePath = !trimmed.startsWith('<') && !trimmed.startsWith('(') &&
            (trimmed.match(/\.(jpg|jpeg|png|gif|webp)$/i) || trimmed.startsWith('public\\') || trimmed.includes('\\match\\'));

        if (isImagePath) {
            const cleanPath = trimmed.replace(/\\/g, '/').replace(/^public\//, '/');
            renderedOutput.push(
                <div key={`img-${index}`} className={styles.imgContainer}>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse" />
                    <img
                        src={cleanPath}
                        alt="Review"
                        className="w-full object-contain relative z-10"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            );
            return;
        }

        // 해시태그로 끝나는 줄은 건너뛰기 (#20대리프팅 #볼처짐개선 등)
        if (trimmed.startsWith('#') && !trimmed.includes(' ')) {
            return;
        }
        if (trimmed.match(/^#\S+(\s+#\S+)*$/)) {
            return;
        }

        // 3. 일반 텍스트 (인라인 스타일 파싱 적용)
        renderedOutput.push(
            <p key={`p-${index}`} className={styles.text}>
                {parseInlineStyles(trimmed, styles)}
            </p>
        );
    });

    return <div className="text-center">{renderedOutput}</div>;
};

// 인라인 스타일 변환 헬퍼 함수
const parseInlineStyles = (text: string, styles: Record<string, string>) => {
    const parts = text.split(/((?:<(?:b|high|orange|blue)>).*?(?:<\/(?:b|high|orange|blue)>))/gi);

    return parts.map((part, i) => {
        if (part.match(/^<high>/i)) {
            const content = part.replace(/^<high>|(<\/high>)$/ig, '');
            return <span key={i} className={styles.high}>{content}</span>;
        }
        if (part.match(/^<orange>/i)) {
            const content = part.replace(/^<orange>|(<\/orange>)$/ig, '');
            return <span key={i} className={styles.orange}>{content}</span>;
        }
        if (part.match(/^<blue>/i)) {
            const content = part.replace(/^<blue>|(<\/blue>)$/ig, '');
            return <span key={i} className={styles.blue}>{content}</span>;
        }
        if (part.match(/^<b>/i)) {
            const content = part.replace(/^<b>|(<\/b>)$/ig, '');
            return <strong key={i} className={styles.bold}>{content}</strong>;
        }
        return part;
    });
};
