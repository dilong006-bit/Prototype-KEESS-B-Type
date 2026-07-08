import type { Metadata } from 'next';
import '@/styles/axai.css';
import Nav from '@/components/common/Nav';
import RevealInit from '@/components/common/RevealInit';
import AxModalProvider from '@/components/sections/axai/AxModals';
import Sections from '@/components/sections/axai/Sections';

export const metadata: Metadata = {
  title: 'AX·AI 전환 | KEESS — 진단부터 성과까지 End-to-End AX Partner',
  description:
    'AI를 배우는 데서 멈추지 않습니다. 일하는 방식을 바꿉니다. AI 성숙도 진단·AX Framework 5단계·직무별 Skill Matrix·End-to-End 5 Step으로 조직의 AX 전환을 설계합니다.',
};

export default function AxAiPage() {
  return (
    <div className="tint-p1">
      <Nav current="ax-ai" consultHref="#inq" />
      <RevealInit />
      <AxModalProvider>
        <Sections />
      </AxModalProvider>
    </div>
  );
}
