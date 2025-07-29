'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Circle,
  Loader2
} from 'lucide-react'

interface FormStep {
  id: string
  title: string
  description?: string
  component: React.ComponentType<{
    data: any
    updateData: (data: any) => void
    errors: Record<string, string>
  }>
  validation?: (data: any) => Record<string, string>
}

interface MultiStepFormProps {
  steps: FormStep[]
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  showProgress?: boolean
  showStepNumbers?: boolean
  className?: string
  submitButtonText?: string
  loadingText?: string
}

export function MultiStepForm({
  steps,
  onSubmit,
  initialData = {},
  showProgress = true,
  showStepNumbers = true,
  className = '',
  submitButtonText = 'Submit',
  loadingText = 'Submitting...'
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const updateFormData = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }))
    // Clear errors when data is updated
    setErrors({})
  }

  const validateCurrentStep = (): boolean => {
    if (currentStepData.validation) {
      const stepErrors = currentStepData.validation(formData)
      setErrors(stepErrors)
      return Object.keys(stepErrors).length === 0
    }
    return true
  }

  const goToNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const goToPrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                disabled={index > currentStep}
                className={`flex flex-col items-center gap-2 transition-colors ${
                  index <= currentStep 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-600'
                } ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2
                  ${index < currentStep 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : index === currentStep 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">
                      {showStepNumbers ? index + 1 : ''}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-center max-w-16">
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Step Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h3>
          {currentStepData.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {currentStepData.description}
            </p>
          )}
        </div>

        {/* Step Component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <currentStepData.component
              data={formData}
              updateData={updateFormData}
              errors={errors}
            />
          </motion.div>
        </AnimatePresence>

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Please fix the following errors:
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>• {message}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={goToPrevious}
            disabled={isFirstStep}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${isFirstStep 
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {!isLastStep ? (
              <button
                onClick={goToNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {submitButtonText}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Example step components
export function TextInputStep({ data, updateData, errors }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={data.fullName || ''}
          onChange={(e) => updateData({ fullName: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => updateData({ email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>
    </div>
  )
}

export function SelectStep({ data, updateData, errors }: any) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Laboratory Type
        </label>
        <select
          value={data.labType || ''}
          onChange={(e) => updateData({ labType: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.labType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        >
          <option value="">Select laboratory type</option>
          <option value="research">Research Laboratory</option>
          <option value="clinical">Clinical Laboratory</option>
          <option value="pharmaceutical">Pharmaceutical Laboratory</option>
          <option value="biotechnology">Biotechnology Laboratory</option>
        </select>
        {errors.labType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.labType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Team Size
        </label>
        <select
          value={data.teamSize || ''}
          onChange={(e) => updateData({ teamSize: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.teamSize ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        >
          <option value="">Select team size</option>
          <option value="1-10">1-10 people</option>
          <option value="11-50">11-50 people</option>
          <option value="51-200">51-200 people</option>
          <option value="200+">200+ people</option>
        </select>
        {errors.teamSize && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.teamSize}</p>
        )}
      </div>
    </div>
  )
}

export function ConfirmationStep({ data }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Please confirm your information:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Laboratory Type:</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.labType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Team Size:</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.teamSize}</span>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>By submitting this form, you agree to our terms of service and privacy policy.</p>
      </div>
    </div>
  )
} 