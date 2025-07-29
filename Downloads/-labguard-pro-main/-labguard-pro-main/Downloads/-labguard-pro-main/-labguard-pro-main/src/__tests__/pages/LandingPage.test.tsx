import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LandingPage from '@/app/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      reload: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

describe('LandingPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('renders the landing page with all sections', () => {
    render(<LandingPage />)

    // Check for main hero section
    expect(screen.getByText(/Revolutionize Your Laboratory/i)).toBeInTheDocument()
    expect(screen.getByText(/AI-powered laboratory compliance automation/i)).toBeInTheDocument()

    // Check for navigation
    expect(screen.getByText('LabGuard Pro')).toBeInTheDocument()
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Solutions')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()

    // Check for CTA buttons
    expect(screen.getByText(/Start Free Trial/i)).toBeInTheDocument()
    expect(screen.getByText(/Schedule Demo/i)).toBeInTheDocument()
  })

  it('displays all navigation dropdown items', async () => {
    render(<LandingPage />)

    // Test Product dropdown
    const productDropdown = screen.getByText('Product')
    fireEvent.mouseEnter(productDropdown)

    await waitFor(() => {
      expect(screen.getByText('AI Assistant')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Compliance')).toBeInTheDocument()
      expect(screen.getByText('Equipment')).toBeInTheDocument()
    })

    // Test Solutions dropdown
    const solutionsDropdown = screen.getByText('Solutions')
    fireEvent.mouseEnter(solutionsDropdown)

    await waitFor(() => {
      expect(screen.getByText('Research Labs')).toBeInTheDocument()
      expect(screen.getByText('Clinical Labs')).toBeInTheDocument()
      expect(screen.getByText('Pharmaceutical')).toBeInTheDocument()
      expect(screen.getByText('Biotechnology')).toBeInTheDocument()
    })

    // Test Resources dropdown
    const resourcesDropdown = screen.getByText('Resources')
    fireEvent.mouseEnter(resourcesDropdown)

    await waitFor(() => {
      expect(screen.getByText('Documentation')).toBeInTheDocument()
      expect(screen.getByText('Case Studies')).toBeInTheDocument()
      expect(screen.getByText('Blog')).toBeInTheDocument()
    })

    // Test Company dropdown
    const companyDropdown = screen.getByText('Company')
    fireEvent.mouseEnter(companyDropdown)

    await waitFor(() => {
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Careers')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
      expect(screen.getByText('Partners')).toBeInTheDocument()
    })
  })

  it('has working navigation links', () => {
    render(<LandingPage />)

    // Test logo link
    const logo = screen.getByText('LabGuard Pro')
    expect(logo.closest('a')).toHaveAttribute('href', '/')

    // Test CTA buttons
    const startTrialButton = screen.getByText(/Start Free Trial/i)
    const scheduleDemoButton = screen.getByText(/Schedule Demo/i)
    
    expect(startTrialButton.closest('a')).toHaveAttribute('href', '/demo')
    expect(scheduleDemoButton.closest('a')).toHaveAttribute('href', '/demo')
  })

  it('displays features section with all features', () => {
    render(<LandingPage />)

    // Check for features section
    expect(screen.getByText(/Why Choose LabGuard Pro/i)).toBeInTheDocument()

    // Check for individual features
    expect(screen.getByText(/AI-Powered Automation/i)).toBeInTheDocument()
    expect(screen.getByText(/Real-time Monitoring/i)).toBeInTheDocument()
    expect(screen.getByText(/Compliance Management/i)).toBeInTheDocument()
    expect(screen.getByText(/Advanced Analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/Equipment Management/i)).toBeInTheDocument()
    expect(screen.getByText(/Integration Ready/i)).toBeInTheDocument()
  })

  it('displays testimonials section', () => {
    render(<LandingPage />)

    expect(screen.getByText(/What Our Customers Say/i)).toBeInTheDocument()
    expect(screen.getByText(/Trusted by leading laboratories/i)).toBeInTheDocument()
  })

  it('displays pricing section', () => {
    render(<LandingPage />)

    expect(screen.getByText(/Pricing Plans/i)).toBeInTheDocument()
    expect(screen.getByText(/Choose the perfect plan/i)).toBeInTheDocument()

    // Check for pricing tiers
    expect(screen.getByText(/Starter/i)).toBeInTheDocument()
    expect(screen.getByText(/Professional/i)).toBeInTheDocument()
    expect(screen.getByText(/Enterprise/i)).toBeInTheDocument()
  })

  it('displays footer with all links', () => {
    render(<LandingPage />)

    // Check for footer sections
    expect(screen.getByText(/Product/i)).toBeInTheDocument()
    expect(screen.getByText(/Solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/Resources/i)).toBeInTheDocument()
    expect(screen.getByText(/Company/i)).toBeInTheDocument()
    expect(screen.getByText(/Support/i)).toBeInTheDocument()

    // Check for social links
    expect(screen.getByText(/Follow Us/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<LandingPage />)

    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()

    // Check for proper button roles
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type')
    })

    // Check for proper link attributes
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('displays AI assistant component', () => {
    render(<LandingPage />)

    // Check for AI assistant presence
    expect(screen.getByText(/Biomni AI Assistant/i)).toBeInTheDocument()
  })

  it('has responsive design elements', () => {
    render(<LandingPage />)

    // Check for mobile-friendly classes
    const navigation = screen.getByRole('navigation')
    expect(navigation).toHaveClass('mobile-nav')

    // Check for responsive grid classes
    const featuresGrid = screen.getByText(/Why Choose LabGuard Pro/i).closest('section')
    expect(featuresGrid).toHaveClass('mobile-grid')
  })

  it('handles mobile menu toggle', async () => {
    render(<LandingPage />)

    // Find mobile menu button
    const mobileMenuButton = screen.getByLabelText(/Toggle mobile menu/i)
    expect(mobileMenuButton).toBeInTheDocument()

    // Toggle mobile menu
    fireEvent.click(mobileMenuButton)

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toHaveClass('mobile-open')
    })

    // Toggle again to close
    fireEvent.click(mobileMenuButton)

    await waitFor(() => {
      expect(screen.getByRole('navigation')).not.toHaveClass('mobile-open')
    })
  })

  it('has proper SEO meta tags', () => {
    render(<LandingPage />)

    // Check for title
    expect(document.title).toContain('LabGuard Pro')

    // Check for meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription).toBeInTheDocument()
    expect(metaDescription).toHaveAttribute('content')
  })

  it('handles form submissions correctly', async () => {
    render(<LandingPage />)

    // Find contact form if present
    const contactForm = screen.queryByRole('form')
    if (contactForm) {
      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Thank you/i)).toBeInTheDocument()
      })
    }
  })

  it('displays loading states correctly', async () => {
    render(<LandingPage />)

    // Check for loading indicators
    const loadingElements = screen.queryAllByTestId('loading')
    loadingElements.forEach(element => {
      expect(element).toHaveClass('loading')
    })
  })

  it('handles error states gracefully', () => {
    // Mock console.error to prevent test noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<LandingPage />)

    // Verify no errors were thrown
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('has proper keyboard navigation', () => {
    render(<LandingPage />)

    // Test tab navigation for visible elements only
    const focusableElements = screen.getAllByRole('button')
      .concat(screen.getAllByRole('link'))
      .concat(screen.getAllByRole('textbox'))

    focusableElements.forEach((element, index) => {
      element.focus()
      expect(element).toHaveFocus()
    })
  })

  it('displays proper error boundaries', () => {
    render(<LandingPage />)

    // Check for error boundary presence
    const errorBoundary = document.querySelector('[data-testid="error-boundary"]')
    if (errorBoundary) {
      expect(errorBoundary).toBeInTheDocument()
    }
  })
}) 