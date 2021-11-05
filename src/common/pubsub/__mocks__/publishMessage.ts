'use strict';
export async function publishMessageWithCustomAttributes(
  data,
): Promise<[string]> {
  if (data.key === '78910_TOFAIL') return null;
  return data.processId;
}
