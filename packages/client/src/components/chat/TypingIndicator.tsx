// const TypingIndicator = () => {
//    return (
//       <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
//          <Dot />
//          <Dot />
//          <Dot className="[animation-delay:0.2s]" />
//          <Dot className="[animation-delay:0.4s]" />
//       </div>
//    );
// };

// type DotProps = {
//    className?: string;
// };
// const Dot = ({ className }: DotProps) => (
//    <div
//       className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${className}`}
//    ></div>
// );
// export default TypingIndicator;

import React, { createContext, useContext, type ReactNode } from 'react';

type TypingIndicatorContextType = {
   dotCount: number;
   baseDelay?: number;
};

const TypingIndicatorContext = createContext<
   TypingIndicatorContextType | undefined
>(undefined);

export const useTypingIndicator = () => {
   const context = useContext(TypingIndicatorContext);
   if (!context)
      throw new Error(
         'useTypingIndicator must be used within a TypingIndicator'
      );
   return context;
};

type TypingIndicatorProps = {
   children?: ReactNode;
   dotCount?: number; // number of dots
   baseDelay?: number; // delay increment in seconds
};

const TypingIndicator = ({
   children,
   dotCount = 4,
   baseDelay = 0.2,
}: TypingIndicatorProps) => {
   return (
      <TypingIndicatorContext.Provider value={{ dotCount, baseDelay }}>
         <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
            {children || <TypingIndicator.Dots />}
         </div>
      </TypingIndicatorContext.Provider>
   );
};

// Subcomponent for dots
TypingIndicator.Dots = () => {
   const { dotCount, baseDelay } = useTypingIndicator();
   const dots = Array.from({ length: dotCount }).map((_, i) => (
      <TypingIndicator.Dot
         key={i}
         style={{ animationDelay: `${i * Number(baseDelay)}s` }}
      />
   ));
   return <>{dots}</>;
};

// Individual Dot
TypingIndicator.Dot = ({
   style,
   className,
}: {
   style?: React.CSSProperties;
   className?: string;
}) => (
   <div
      className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${className || ''}`}
      style={style}
   ></div>
);

export default TypingIndicator;
