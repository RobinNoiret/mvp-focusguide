import React from 'react';

interface AppIconProps {
  variant?: 'green' | 'black' | 'white';
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ variant = 'green', className = '' }) => {
  const colorMap = {
    green: '#D9FC00',
    black: '#262626',
    white: '#EDEAE9',
  };

  return (
    <svg
      width="82"
      height="87"
      viewBox="0 0 82 87"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M82 87C78.6634 65.5298 61.7404 36.5847 20.2178 68.4824C20.2132 68.4883 20.2087 68.4941 20.2041 68.5H20.1953C20.2028 68.4942 20.2103 68.4882 20.2178 68.4824C35.8679 48.3619 40.9926 20.3509 0 0H82V87Z"
        fill={colorMap[variant]}
      />
    </svg>
  );
};
