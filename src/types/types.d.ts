export interface IImage {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
}

export interface IButton {
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
  loader?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color?: string;
}

export interface IApiResponse<T = any> {
  data: T;
  message: string;
}
