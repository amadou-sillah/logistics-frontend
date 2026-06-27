import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="rounded-xl bg-red-50 p-8 text-center dark:bg-red-900/20">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Something went wrong</h2>
            <p className="mt-2 text-red-600 dark:text-red-300">Please refresh the page or try again later.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
