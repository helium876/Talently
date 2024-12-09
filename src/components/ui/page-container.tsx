'use client'

interface PageContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

export function PageContainer({ children, title, description, action }: PageContainerProps) {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {(title || action) && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              )}
              {description && (
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              )}
            </div>
            {action && (
              <div className="ml-4">{action}</div>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
} 