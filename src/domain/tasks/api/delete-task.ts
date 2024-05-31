import { supabaseClient } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

export async function deleteTask(taskId: string): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'delete', async () => {
    const result = await supabaseClient().from('tasks').delete().match({ id: taskId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}
