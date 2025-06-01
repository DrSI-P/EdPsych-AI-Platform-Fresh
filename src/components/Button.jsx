import React from 'react';
import styles from '../styles/Button.module.css';
import clsx from 'clsx';

/**
 * Button component that uses CSS modules to ensure styles are properly applied
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline, ghost, nursery, earlyPrimary)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props.rest - Additional button attributes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

/**
 * Link styled as a button
 */
export const ButtonLink = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  href,
  ...rest
}) => {
  return (
    <a
      href={href}
      className={clsx(
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Button;