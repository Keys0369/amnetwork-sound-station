import React, { CSSProperties } from "react";

/**
 * Button component
 * Accessible, customizable button with variants
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", disabled = false, children, className, ...props }, ref) => {
    const baseStyles: CSSProperties = {
      padding: size === "sm" ? "8px 16px" : size === "lg" ? "16px 24px" : "12px 20px",
      fontSize: size === "sm" ? "14px" : size === "lg" ? "18px" : "16px",
      borderRadius: "8px",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600,
      transition: "all 0.2s",
      opacity: disabled ? 0.6 : 1,
    };

    const variantStyles: Record<string, CSSProperties> = {
      primary: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
      },
      secondary: {
        backgroundColor: "#e5e7eb",
        color: "#1f2937",
      },
      danger: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
      },
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{ ...baseStyles, ...variantStyles[variant] }}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * Card component
 * Container for content with consistent styling
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className, ...props }, ref) => {
  const cardStyles: CSSProperties = {
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  };

  return (
    <div ref={ref} style={cardStyles} className={className} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

/**
 * Slider component
 * Range input for volume, pan, playback speed
 */
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ min = 0, max = 100, step = 1, value, onChange, ...props }, ref) => {
    const sliderStyles: CSSProperties = {
      width: "100%",
      height: "6px",
      borderRadius: "3px",
      background: "#e5e7eb",
      outline: "none",
      WebkitAppearance: "none",
    };

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        style={sliderStyles}
        {...props}
      />
    );
  }
);

Slider.displayName = "Slider";

/**
 * Toggle component
 * Switch for boolean states
 */
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ checked = false, onChange, ...props }, ref) => {
    const toggleStyles: CSSProperties = {
      position: "relative",
      width: "50px",
      height: "24px",
      appearance: "none",
      borderRadius: "12px",
      background: checked ? "#3b82f6" : "#d1d5db",
      cursor: "pointer",
      transition: "background 0.3s",
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        style={toggleStyles}
        {...props}
      />
    );
  }
);

Toggle.displayName = "Toggle";

/**
 * IconButton component
 * Small button for icons
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "md", children, ...props }, ref) => {
    const iconButtonStyles: CSSProperties = {
      width: size === "sm" ? "32px" : size === "lg" ? "48px" : "40px",
      height: size === "sm" ? "32px" : size === "lg" ? "48px" : "40px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "#f3f4f6",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
    };

    return (
      <button ref={ref} style={iconButtonStyles} {...props}>
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

/**
 * ThemeProvider component
 * Provides theme context to child components
 */
export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  mode: "light" | "dark";
}

export const defaultLightTheme: Theme = {
  primary: "#3b82f6",
  secondary: "#10b981",
  background: "#ffffff",
  foreground: "#1f2937",
  mode: "light",
};

export const defaultDarkTheme: Theme = {
  primary: "#60a5fa",
  secondary: "#34d399",
  background: "#1f2937",
  foreground: "#f9fafb",
  mode: "dark",
};

export interface ThemeProviderProps {
  theme?: Theme;
  children: React.ReactNode;
}

export const ThemeContext = React.createContext<Theme>(defaultLightTheme);

export const ThemeProvider = ({ theme = defaultLightTheme, children }: ThemeProviderProps) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const theme = React.useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return theme;
};
