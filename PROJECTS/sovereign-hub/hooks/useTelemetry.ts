'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface TelemetryEvent {
  id: string
  source_node: string
  target_node: string
  data_type: string
  status: 'SUCCESS' | 'FAILURE' | 'PENDING'
  timestamp: string
}

export function useTelemetry() {
  const [events, setEvents] = useState<TelemetryEvent[]>([])

  useEffect(() => {
    // Initial fetch
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('telemetry_node_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20)

      if (!error && data) {
        setEvents(data)
      }
    }

    fetchLogs()

    // Real-time subscription
    const channel = supabase
      .channel('telemetry_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', table: 'telemetry_node_logs' },
        (payload) => {
          setEvents((prev) => [payload.new as TelemetryEvent, ...prev].slice(0, 20))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return events
}
