// Shared Components Barrel Export
// This file exports all shared components for easy importing

export * from './button.component'
export * from './input.component'
export * from './card.component'
export * from './loading-spinner.component'
export * from './alert.component'
export * from './pagination.component'
export * from './rating.component'
export * from './navigation.component'
export * from './date-input.component'
export * from './select.component'
export * from './radio-group.component'
export * from './checkbox-group.component'

// Re-export types for convenience
export type { ButtonVariant, ButtonSize } from './button.component'

export type { InputType } from './input.component'

export type { CardVariant, CardSize } from './card.component'

export type { SpinnerSize, SpinnerVariant } from './loading-spinner.component'

export type { AlertType, AlertSize } from './alert.component'

export type { RatingSize } from './rating.component'

export type { NavItem, UserInfo } from './navigation.component'

export type { SelectOption, SelectOptionGroup } from './select.component'

export type { RadioOption } from './radio-group.component'

export type { CheckboxOption } from './checkbox-group.component'
