import Github from '@/components/GitHub'

export function Footer() {
  return (
    <footer className="text-gray-400 text-xs flex items-center justify-center py-6">
      <a
        href="https://github.com/haikhalfakhreez/qashier-carpark"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-black transition-colors"
      >
        <Github className="h-6 w-6" />
      </a>
    </footer>
  )
}
