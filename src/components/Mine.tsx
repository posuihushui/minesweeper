"use client";

export const Mine: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
}> = ({ children, onClick, style }) => {
  return (
    <button
      onClick={onClick}
      style={{ ...style, border: "1px solid red", width: 60, height: 60 }}
    >
      {children}
    </button>
  );
};
