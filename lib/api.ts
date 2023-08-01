type CarparkResponse = {
  items: CarparkItem[]
}

type CarparkItem = {
  timestamp: Date
  carpark_data: CarparkData[]
}

type CarparkData = {
  carpark_info: CarkparkInfo[]
  carpark_number: string
  update_datetime: Date
}

type CarkparkInfo = {
  total_lots: string
  lot_type: string
  lots_available: string
}

type CarparkCategory = 'small' | 'medium' | 'big' | 'large'

type CarparkValue = 'highest' | 'lowest'

export type Carpark = {
  [key in CarparkCategory]: {
    [key in CarparkValue]: {
      carparkIds: string[]
      availableLot: number
    }
  }
}

/**
 * Parse the carpark data into a more usable format
 * Get only the highest and lowest carpark lots
 * 1. Small: <100 lots
 * 2. Medium: >=100 - <300 lots
 * 3. Big: >=300 - <400 lots
 * 4. Large: >=400 lots
 */
export function parseCarparkData(carparkResponse: CarparkResponse): Carpark {
  const carparkData = carparkResponse.items[0].carpark_data

  const carpark: Carpark = {
    small: {
      highest: { carparkIds: [], availableLot: 0 },
      lowest: { carparkIds: [], availableLot: Infinity },
    },
    medium: {
      highest: { carparkIds: [], availableLot: 0 },
      lowest: { carparkIds: [], availableLot: Infinity },
    },
    big: {
      highest: { carparkIds: [], availableLot: 0 },
      lowest: { carparkIds: [], availableLot: Infinity },
    },
    large: {
      highest: { carparkIds: [], availableLot: 0 },
      lowest: { carparkIds: [], availableLot: Infinity },
    },
  }

  for (const data of carparkData) {
    const { total, availability } = data.carpark_info.reduce(
      (acc, current) => ({
        total: acc.total + Number(current.total_lots),
        availability: acc.availability + Number(current.lots_available),
      }),
      { total: 0, availability: 0 }
    )

    // Get the category of the carpark
    let category: CarparkCategory

    if (total < 100) category = 'small'
    else if (total >= 100 && total < 300) category = 'medium'
    else if (total >= 300 && total < 400) category = 'big'
    else category = 'large'

    // Get which carpark has the highest and lowest lots
    const value = carpark[category]

    if (availability > value.highest.availableLot) {
      value.highest.availableLot = availability
      value.highest.carparkIds = [data.carpark_number]
    } else if (availability === value.highest.availableLot) {
      value.highest.carparkIds.push(data.carpark_number)
    }

    if (availability < value.lowest.availableLot) {
      value.lowest.availableLot = availability
      value.lowest.carparkIds = [data.carpark_number]
    } else if (availability === value.lowest.availableLot) {
      value.lowest.carparkIds.push(data.carpark_number)
    }
  }

  return carpark
}

export async function getCarparkData(): Promise<CarparkResponse> {
  const now = new Date().toISOString()
  const res = await fetch(
    `https://api.data.gov.sg/v1/transport/carpark-availability?date_time=${now}`,
    {
      headers: {
        Accept: 'application/json',
      },
      // Revalidate every 30 seconds, instead of 60 seconds
      // in the background/server so that when the page is
      // refreshed, the data is already updated.
      next: { revalidate: 30 },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
