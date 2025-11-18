# Authentication System

A fully refactored authentication system with Login, Sign Up, and Forgot Password pages.

## Folder Structure

```
auth/
├── components/
│   ├── BackgroundParticles.jsx     # Background particle effects
│   ├── CheckboxField.jsx            # Checkbox input component
│   ├── ColoredPanel.jsx             # Colored panel with title/subtitle
│   ├── InputField.jsx               # Text/email input component
│   ├── NavLink.jsx                  # Navigation link button
│   ├── SocialButton.jsx             # Social login buttons
│   └── SubmitButton.jsx             # Form submit button
├── hooks/
│   └── useAuthForm.js               # Form state management hook
├── utils/
│   ├── constants.js                 # Constants (configs, SVGs, etc.)
│   └── validation.js                # Form validation functions
├── AuthSystem.jsx                   # Main auth component
├── Login/
│   └── page.jsx                     # Login page route
├── SignUp/
│   └── page.jsx                     # Sign up page route
├── ForgetPassword/
│   └── page.jsx                     # Forgot password page route
└── Particles.jsx                    # Particle animation component
```

## Pages

### Login: `/auth/Login`
- Email and password inputs
- Password visibility toggle
- Social login options (Google, Apple)
- Links to Sign Up and Forgot Password

### Sign Up: `/auth/SignUp`
- First and last name inputs
- Email and password inputs
- Terms & conditions checkbox
- Social login options
- Link to Login page

### Forgot Password: `/auth/ForgetPassword`
- Email input only
- Sends reset link
- Social login options
- Back to Login link

## Features

✅ Shared form state management via `useAuthForm` hook
✅ Reusable components for forms, buttons, and fields
✅ Centralized validation logic
✅ Responsive design (mobile, tablet, desktop)
✅ Error handling with field-level validation
✅ Password visibility toggle
✅ Smooth transitions between auth pages
✅ Background particle effects
✅ Accessible form elements

## Usage

Each page uses the `AuthSystem` component with an `initialPage` prop to determine which auth form to display. The `useAuthForm` hook manages all form state, validation, and navigation between pages.
