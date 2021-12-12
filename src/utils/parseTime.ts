import { format, parse } from 'date-fns'

export const parseTime = (time: string) => {
  const firstTime = parse(time.split(' ')[0], 'yyyyMMddHHmmss', new Date())
  return format(firstTime, "MMMM do, yyyy, 'at' HH:mm")
}
