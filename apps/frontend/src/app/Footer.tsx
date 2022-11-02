import {
  FaCreativeCommons,
  FaCreativeCommonsBy,
  FaCreativeCommonsSa,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa'
import { format } from 'date-fns'
import { SignInButton } from './SignInButton'

const CCText =
  'All writing, images, and other material on this website (unless otherwise stated) is licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0 license. This means that you are free to redistribute, share, and remix said material granted that you provide proper attribution AND that you share your remixed work under the same license.'

export const Footer = () => (
  <div className="h-24 bg-black text-white w-screen">
    <div className="container flex flex-col items-center justify-center  p-4 mx-auto gap-4 h-full md:flex-row md:justify-between">
      <div className="flex flex-col items-center justify-center gap-4 md:items-start">
        <p>© 2021-{format(new Date(), 'yyyy')} Thomas F. K. Jorna</p>
        {/* <Tooltip label={CCText}> */}

        <a className="flex gap-2" href="https://creativecommons.org/licenses/by-sa/4.0">
          <FaCreativeCommons />
          <FaCreativeCommonsBy /> <FaCreativeCommonsSa />
        </a>
        {/* </Tooltip> */}
      </div>
      <div className="h-full items-end justify-between">
        <div className="flex gap-6">
          <a href="https://twitter.com/tefkah">
            <span className="sr-only">Twitter</span>
            <FaTwitter />
          </a>
          <a href="https://github.com/tefkah">
            <span className="sr-only">GitHub</span>
            <FaGithub />
          </a>
        </div>

        <SignInButton />
      </div>
    </div>
  </div>
)
