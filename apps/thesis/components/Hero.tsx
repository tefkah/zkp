export const Hero = ({ title }: { title?: string }) => (
  <div className="bg-gradient to-l to flex h-[100vh] items-center justify-center bg-rose-500 from-purple-600 bg-clip-text">
    <h1 className="text-[6vw]">{title}</h1>
  </div>
)

Hero.defaultProps = {
  title: 'with-chakra-ui-typescript',
}
