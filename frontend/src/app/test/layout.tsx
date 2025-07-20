export default function Layout({
  children,
  test1,
  test2
}: {
  children: React.ReactNode
  test1: React.ReactNode
  test2: React.ReactNode
}) {
  return (
    <div className="flex justify-around">
        {test1}
        {children}
        {test2}
    </div>
  )
}