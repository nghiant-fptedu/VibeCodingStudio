import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';

export const RealtimeClock: React.FC = () => {
  const { language, t } = useI18n();
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );

      // Định dạng ngày theo ngôn ngữ
      const viDays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
      const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayOfWeek = (language === 'vi' ? viDays : enDays)[now.getDay()];
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      setDateStr(`${dayOfWeek}, ${day}/${month}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  return (
    <div
      className="fixed bottom-3 md:bottom-6 right-3 md:right-8 z-40 hidden sm:flex items-center gap-2.5 h-11 md:h-12 px-3.5 md:px-4 py-2 rounded-full select-none hover:border-white/20 transition-all"
      title={t.clock.tooltip}
    >
      {/* Live Pulsing Beacon Dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary shadow-glow-teal" />
      </span>

      {/* Clock Readout */}
      <span className="font-mono text-xs md:text-sm font-semibold text-slate-100 tabular-nums tracking-wider">
        {time || '--:--:--'}
      </span>

      {/* Subtle Date Badge */}
      {dateStr && (
        <span className="hidden md:inline text-[11px] font-medium text-slate-400 pl-2 border-l border-white/10">
          {dateStr}
        </span>
      )}
    </div>
  );
};
