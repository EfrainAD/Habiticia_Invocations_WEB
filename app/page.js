import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
   return (
      <div className={styles.page}>
         <main className={styles.main}>
            <Image
               className={styles.logo}
               src="/next.svg"
               alt="Next.js logo"
               width={180}
               height={38}
               priority
            />
            <h1>Habitica Invocation</h1>
            <p>
               This isn&apos;t really a Next.js project, but since regular React
               templates were discontinued, I thought I&apos;d try something
               different — even if this project doesn&apos;t use most of
               Next.js&apos;s core features.
            </p>
            <p>
               This adds extra features to the Habitica app/website. It&apos;s
               stuff that I had wished already exist. You can automate things
               like using a skill multiple times with one click or until you
               have x amount mana left over. It also checks which equipment
               gives you the highest stat in a category and switches it
               automatically, so you don&apos;t have to go clicking through your
               whole inventory every time you want to optimize a skill.
               I&apos;ve got more features planned as well.
            </p>
            <p>
               I&apos;m still working on the features and saving the UI for
               last. Since I use this tool myself, functionality comes first.
               I&apos;m not a UX designer, so I&apos;m holding off on the
               interface for now.
            </p>

            <h1>Things to do:</h1>
            <ul>
               <li>Save background, mount, and pet combos as reusable sets</li>
               <li>
                  List pets that can be converted to mounts and auto-feed them
               </li>
               <li>View today&apos;s drops</li>
               <li>
                  Add a feature for dailies that can carry over to the next day,
                  this will require a complete UI overhaul to implement.
               </li>
            </ul>
         </main>
         <footer className={styles.footer}>
            <span>Next.js stuff &rarr;</span>
            <a
               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image
                  aria-hidden
                  src="/file.svg"
                  alt="File icon"
                  width={16}
                  height={16}
               />
               Learn
            </a>
            <a
               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image
                  aria-hidden
                  src="/window.svg"
                  alt="Window icon"
                  width={16}
                  height={16}
               />
               Examples
            </a>
            <a
               href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image
                  aria-hidden
                  src="/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
               />
               Go to nextjs.org →
            </a>
         </footer>
      </div>
   )
}
