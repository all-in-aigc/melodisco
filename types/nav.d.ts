import { ReactNode } from "react";

export interface Nav {
  title: string;
  name?: string;
  icon?: ReactNode;
  url?: string;
  target?: string;
  active?: boolean;
}
