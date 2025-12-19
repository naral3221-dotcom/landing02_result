import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Step6Result } from '../components/matching/steps/Step6Result';

const ResultPage = () => {
  const [searchParams] = useSearchParams();

  const userData = useMemo(() => {
    // Basic validation / defaults
    const name = searchParams.get('name') || '홍길동';
    const phone = searchParams.get('phone') || '010-0000-0000';
    const age = searchParams.get('age') || '30대';
    
    // Parse tags (comma separated)
    const tagsParam = searchParams.get('tags');
    const selectedTags = tagsParam ? tagsParam.split(',') : ['이중턱', '탄력', '윤곽관리'];

    // Parse boolean
    const expParam = searchParams.get('exp');
    const hasContouringExp = expParam === 'true';

    const priority = searchParams.get('priority') || '자연스러움';

    return {
      name,
      phone,
      age,
      selectedTags,
      hasContouringExp,
      priority
    };
  }, [searchParams]);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-black">
      {/* Mobile container constraint - normally handled by layout but enforcing here just in case */}
      <Step6Result userData={userData} />
    </div>
  );
};

export default ResultPage;
