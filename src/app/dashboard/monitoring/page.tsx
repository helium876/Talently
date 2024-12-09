'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Health Status Component
function HealthStatus() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHealth() {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
      setLoading(false)
    }
    loadHealth()
  }, [])

  if (loading) return <div>Loading health status...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-lg font-semibold ${
          health.status === 'healthy' ? 'text-green-500' :
          health.status === 'degraded' ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {health.status.toUpperCase()}
        </div>
        {Object.entries(health.details).map(([key, value]) => (
          <div key={key} className="mt-4">
            <h3 className="font-medium">{key}</h3>
            <pre className="mt-2 rounded bg-gray-100 p-2">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Metrics Display Component
function MetricsDisplay() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      const response = await fetch('/api/metrics')
      const data = await response.json()
      setMetrics(data)
      setLoading(false)
    }
    loadMetrics()
  }, [])

  if (loading) return <div>Loading metrics...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(metrics).map(([category, values]) => (
          <div key={category} className="mt-4">
            <h3 className="font-medium">{category}</h3>
            <pre className="mt-2 rounded bg-gray-100 p-2">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Error Display Component
function ErrorDisplay() {
  const [errors, setErrors] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadErrors() {
      const response = await fetch('/api/errors')
      const data = await response.json()
      setErrors(data)
      setLoading(false)
    }
    loadErrors()
  }, [])

  if (loading) return <div>Loading errors...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(errors).map(([category, stats]) => (
          <div key={category} className="mt-4">
            <h3 className="font-medium">{category}</h3>
            <pre className="mt-2 rounded bg-gray-100 p-2">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function MonitoringPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">System Monitoring</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <HealthStatus />
      </div>

      <div className="mt-6">
        <Tabs defaultValue="metrics">
          <TabsList>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>
          <TabsContent value="metrics">
            <MetricsDisplay />
          </TabsContent>
          <TabsContent value="errors">
            <ErrorDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 