import cn from "classnames";
import type { ButtonHTMLAttributes } from "react";
import React, { forwardRef, useRef } from "react";
import mergeRefs from "react-merge-refs";
import styles from "./Button.module.css";

import LoadingDots from "@/components/ui/LoadingDots";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "slim" | "flat";
  active?: boolean;
  width?: number;
  loading?: boolean;
  Component?: React.ComponentType;
}

const Button = forwardRef<HTMLButtonElement, Props>((props, buttonRef) => {
  const {
    className,
    variant = "flat",
    children,
    active,
    width,
    loading = false,
    disabled = false,
    style = {},
    Component = "button",
    ...rest
  } = props;
  const ref = useRef(null);
  const rootClassName = cn(
    styles.root,
    {
      [styles.slim as string]: variant === "slim",
      [styles.loading as string]: loading,
      [styles.disabled as string]: disabled,
    },
    className
  );
  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      {...rest}
    >
      {children}
      {loading && (
        <i className="m-0 flex pl-2">
          <LoadingDots />
        </i>
      )}
    </Component>
  );
});

Button.displayName = "Button";

export default Button;
