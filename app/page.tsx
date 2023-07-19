import camelCase from 'camelcase'
import { getCarparkData, parseCarparkData, type Carpark } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Revalidate } from './revalidate'
import { Footer } from './footer'

export default async function Home() {
  const response = await getCarparkData()
  const data = parseCarparkData(response)

  return (
    <>
      <div className="container flex flex-col max-w-screen-md py-10 space-y-6 flex-1">
        <div className="space-y-2">
          <h1 className="font-bold text-4xl">Carpark Information</h1>
          <p className="text-gray-600 text-base">
            A list of carparks, filtered and categorized by their availability.
          </p>
        </div>

        <Revalidate />

        <Tabs defaultValue="small">
          <h2 className="font-medium text-sm mb-2">Size of carpark 🚗</h2>
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(data).map((key, index) => (
              <TabsTrigger key={index} value={key}>
                {camelCase(key, { pascalCase: true })}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(data).map(([key, value], index) => (
            <TabsContent
              key={index}
              value={key}
              className="border border-gray-200 bg-gray-50/50 rounded-lg p-4 space-y-6"
            >
              <CarpackValueContent type="highest" data={value.highest} />
              <CarpackValueContent type="lowest" data={value.lowest} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </>
  )
}

function CarpackValueContent({
  type,
  data,
}: {
  type: 'highest' | 'lowest'
  data: {
    carparkIds: string[]
    availableLot: number
  }
}) {
  const sortedIds = data.carparkIds.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  return (
    <div>
      <h3 className="font-semibold text-lg">
        {camelCase(type, { pascalCase: true })} number of available lots
      </h3>

      <div className="text-gray-600 mt-1 flex items-center space-x-2 text-sm">
        <span>Available lot:</span>
        <pre className="bg-gray-100 rounded px-1 py-0.5 border border-gray-200 inline-block font-medium tabular-nums">
          {data.availableLot}
        </pre>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
        {sortedIds.map((id) => (
          <div
            key={id}
            className="px-4 py-1 rounded-md bg-blue-700 text-white font-semibold text-xs tabular-nums border border-blue-800 min-w-[80px] flex justify-center"
          >
            {id}
          </div>
        ))}
      </div>
    </div>
  )
}
