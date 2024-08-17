import {
  BsDiscord,
  BsGithub,
  BsReddit,
  BsTelegram,
  BsThreads,
  BsTwitterX,
} from "react-icons/bs";
import { FaGithub, FaProductHunt, FaSearch } from "react-icons/fa";

import { MdOutlineMail } from "react-icons/md";
import { SiBuymeacoffee } from "react-icons/si";

export default function () {
  return (
    <div className="mx-auto flex flex-row items-center justify-center">
      <a
        href="https://twitter.com/idoubicc"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsTwitterX className="text-lg" />
      </a>
      <a
        href="https://www.producthunt.com/posts/melodisco"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <FaProductHunt className="text-xl" />
      </a>
      <a
        href="https://github.com/all-in-aigc/melodisco"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <FaGithub className="text-xl" />
      </a>

      {/* <a
        href="https://discord.gg/kfbbRha3"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsDiscord className="text-lg" />
      </a> */}
      {/* <a
        href="https://t.me/+oLPByEgv-2k3NWM8"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsTelegram className="text-lg" />
      </a> */}
      {/* <a
        href="https://www.reddit.com/r/thinkany"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsReddit className="text-lg" />
      </a> */}
      {/* <a
        href="https://www.threads.net/@thinkanyai"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsThreads className="text-lg" />
      </a> */}
      <a
        href="https://www.buymeacoffee.com/idoubi"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <SiBuymeacoffee className="text-lg" />
      </a>
      {/* <a
        href="mailto:support@trys.ai"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <MdOutlineMail className="text-xl" />
      </a> */}
      <a
        href="https://thinkany.ai"
        target="_blank"
        rel="nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <FaSearch className="text-md" />
      </a>
    </div>
  );
}
