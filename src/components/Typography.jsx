import React from 'react';
import styles from '../styles/Typography.module.css';
import clsx from 'clsx';

/**
 * Typography component that uses CSS modules to ensure styles are properly applied
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='p'] - Typography variant (h1, h2, h3, h4, h5, h6, p)
 * @param {string} [props.size] - Text size (xs, sm, base, lg, xl, xxl)
 * @param {string} [props.weight] - Font weight (light, normal, medium, semibold, bold)
 * @param {string} [props.gradient] - Gradient style (gradient, gradientPurpleBlue, gradientPinkPurple, gradientOrangeRed, gradientGreenTeal)
 * @param {boolean} [props.lead=false] - Whether the text is a lead paragraph
 * @param {boolean} [props.caption=false] - Whether the text is a caption
 * @param {React.ReactNode} props.children - Text content
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.HTMLAttributes<HTMLElement>} props.rest - Additional HTML attributes
 */
const Typography = ({
  variant = 'p',
  size,
  weight,
  gradient,
  lead = false,
  caption = false,
  children,
  className,
  ...rest
}) => {
  const Component = variant;
  
  // Determine which styles to apply
  const cssClasses = clsx(
    // Apply heading styles for h1-h6
    variant === 'h1' && styles.h1,
    variant === 'h2' && styles.h2,
    variant === 'h3' && styles.h3,
    variant === 'h4' && styles.h4,
    variant === 'h5' && styles.h5,
    variant === 'h6' && styles.h6,
    
    // Apply size if specified
    size && styles[size],
    
    // Apply weight if specified
    weight && styles[weight],
    
    // Apply gradient if specified
    gradient && styles[gradient],
    
    // Apply special text styles
    lead && styles.lead,
    caption && styles.caption,
    
    // Apply additional classes
    className
  );
  
  return (
    <Component className={cssClasses} {...rest}>
      {children}
    </Component>
  );
};

/**
 * Gradient Text component - a shorthand for text with gradient effect
 */
export const GradientText = ({ 
  variant = 'span', 
  gradient = 'gradient',
  children,
  className,
  ...rest 
}) => {
  return (
    <Typography 
      variant={variant} 
      gradient={gradient} 
      className={className}
      {...rest}
    >
      {children}
    </Typography>
  );
};

/**
 * Heading components for convenience
 */
export const H1 = (props) => <Typography variant="h1" {...props} />;
export const H2 = (props) => <Typography variant="h2" {...props} />;
export const H3 = (props) => <Typography variant="h3" {...props} />;
export const H4 = (props) => <Typography variant="h4" {...props} />;
export const H5 = (props) => <Typography variant="h5" {...props} />;
export const H6 = (props) => <Typography variant="h6" {...props} />;

/**
 * Lead paragraph component
 */
export const Lead = (props) => <Typography variant="p" lead {...props} />;

/**
 * Caption component
 */
export const Caption = (props) => <Typography variant="p" caption {...props} />;

export default Typography;