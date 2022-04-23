import { format, formatDistance, parse, parseISO } from 'date-fns'

export const parseTime = (time: string) => {
  const firstTime = parse(time.split(' ')[0], 'yyyyMMddHHmmss', new Date())
  return format(firstTime, "MMMM do, yyyy, 'at' HH:mm")
}

export const isoToDate = (time: string) => format(parseISO(time), 'MMMM do, yyyy HH:mm')

export const isoToDateDistance = (time: string) =>
  formatDistance(parseISO(time), new Date(), { addSuffix: true })
