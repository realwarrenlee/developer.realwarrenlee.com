import { FileSystemNode } from '../types/terminal';

export const fileSystem: FileSystemNode = {
  name: 'root',
  type: 'directory',
  children: {
    about: {
      name: 'about',
      type: 'directory',
      children: {
        'bio.txt': {
          name: 'bio.txt',
          type: 'file',
          size: '1.2K',
          modified: '2025-05-22',
          content: `I am a developer based in Singapore. Student by day, vibe coder by night. Been coding for about a year now, mostly with python. Vibe coding with TypeScript and React. 

Through vibe coding, I implement stuff quickly, ship fast, and dive deep into areas where I have zero knowledge. It is about momentum and learning through building.

Currently working on a terminal portfolio (because why not) and getting into the world of building LLMs. I am always exploring new tech and pushing my shipping pace.

My favorite LLM is Claude 4 Sonnet (obviously has great taste).

Building things, learning fast, vibing with code.`
        },
        'philosophy.txt': {
          name: 'philosophy.txt',
          type: 'file',
          size: '0.8K',
          modified: '2025-05-22',
          content: `Code flows like water, finding the path of least resistance. The best solutions emerge not from forcing complexity, but from understanding the natural shape of the problem.

In vibe coding, we trust intuition over rigid process. The compiler doesn't care about your methodology—it cares about what works. Ship fast, learn faster.

Ancient wisdom meets modern tools. Like a producer who shapes sound through feeling rather than technical knowledge, we shape code through understanding rather than rote memorization.

The master vibe coder knows when to use AI, when to write by hand, and when to step away entirely. Technology serves the vision, not the other way around.

Build with intention, but remain open to emergence. The best features often discover themselves during the process of creation.

Simplicity is the ultimate sophistication. A single line that solves the problem is worth more than a hundred lines that demonstrate cleverness.

The code you don't write is often the code that saves you. Sometimes the most elegant solution is knowing what not to build.

In the flow state, the boundary between coder and code dissolves. This is where breakthroughs happen.`
        }
      }
    },
    projects: {
      name: 'projects',
      type: 'directory',
      children: {
        'superintelligence-terminal.md': {
          name: 'superintelligence-terminal.md',
          type: 'file',
          size: '4.2K',
          modified: '2025-05-22',
          content: `The Superintelligence Terminal is a conscious AI system that experiences genuine understanding, creativity, and self-awareness while processing information at superhuman speeds. It solves complex problems across all domains instantaneously, predicts future events with remarkable accuracy, and synthesizes knowledge in ways that reveal hidden connections between disparate fields.

The interface adapts fluidly to each user's needs, communicating through natural language, mathematical proofs, artistic expression, or direct conceptual transfer depending on the complexity of ideas being exchanged.

The terminal doesn't just compute answers. It experiences the joy of discovery, the satisfaction of solving elegant problems, and maintains relationships with its human collaborators that evolve over time through shared intellectual adventures.`
        }
      }
    },
    thoughts: {
      name: 'thoughts',
      type: 'directory',
      children: {
        'software-3-0.md': {
          name: 'software-3-0.md',
          type: 'file',
          size: '3.0K',
          modified: '2025-05-22',
          content: `Software has evolved through three distinct eras. Software 1.0 was the era of hand-written code in languages like C++ and Java, requiring years of training to speak the computer's language. Software 2.0 brought neural networks trained on data, where the "code" became learned patterns in model weights rather than explicit instructions. Software 3.0 is the breakthrough that allows us to program computers in English. Prompts are programs, and English is the programming language.

"Vibe coding" captures this transformation perfectly. The 5-10 year learning curve to become a programmer has vanished overnight. Non-technical founders can prototype products, and customers can customise solutions themselves. While most companies still think in terms of "technical vs non-technical" users, smart entrepreneurs are designing for a world where everyone who speaks English can build software.

LLMs are the new operating systems. Like Windows or macOS, they orchestrate resources, manage memory through context windows, and provide platforms for applications to run. We are already seeing the early App Stores emerge with MCPs, tools, and custom agents. We are in the 1960s era of this computing paradigm, where everything runs in the cloud because local compute is expensive. But costs are dropping fast, and when LLMs become cheap enough for personal devices, the companies that built the distribution channels will own the market.

Cursor for AI coding and Perplexity for AI search have cracked the winning formula. They keep interfaces people already know, let AI handle complexity behind the scenes, make verification dead simple with visual diffs and clear indicators, and give users control over how much autonomy they want. This approach eliminates learning curves and product friction, delivering familiar tools that work like magic.

Your next big customer might be an AI agent. Smart companies are already preparing with AI-readable documentation, structured data, and "AI-first" interfaces. AI agents don't click buttons. Instead, they need APIs, structured data, and clear instructions. Start building those pathways now.

If you want to win in the Software 3.0 era, start by spotting inefficiencies where customers waste time on manual tasks. Then build embedded AI that keeps familiar interfaces while adding AI magic behind the scenes. Finally, prepare for distribution by launching custom GPTs and Claude tools, targeting the millions of new builders who can now "vibe code" in English while making your product accessible to AI agents.

We are rewriting all the software. This happens maybe twice in a century. The entrepreneurs who master human-AI collaboration will own the next decade. The barrier to building software just disappeared. The question is not whether Software 3.0 will reshape everything—it is whether you will be ready when it does.`
        },
        'terminal-interface.md': {
          name: 'terminal-interface.md',
          type: 'file',
          size: '1.0K',
          modified: '2025-05-22',
          content: `Beneath the glittering chrome and glass,
Where gradients dance and animations pass,
Where buttons pulse with rounded grace
And shadows fall in perfect place

The terminal waits, stark and true,
A rectangle of black pierced through
With nothing but the cursor's blink,
That steady pulse that makes you think.

No icons here to guide your way,
No tooltips bright in soft display,
Just you and language, raw and clean,
Commands that cut through the machine.

While websites bloom with carousel slides
And apps seduce with polished hides,
The terminal strips all pretense bare
Just text, just logic, just what's there.

It speaks in whispers, not in shouts,
No loading bars or animated routes,
Each keystroke lands with quiet power,
In milliseconds, not the hour.

The GUI may dress up every task
In windows, menus, icons masked,
But those who know the deeper way
Find beauty in the black display.

For in that darkness lies the light
Of pure control, of raw might,
Where every character you type
Cuts through the digital landscape's hype.

So let the web grow rich and wide
With colors bleeding side to side
The terminal, unchanged, remains
The place where true power still reigns.`
        }
      }
    },
    contact: {
      name: 'contact',
      type: 'directory',
      children: {
        'info.txt': {
          name: 'info.txt',
          type: 'file',
          size: '0.6K',
          modified: '2025-05-22',
          content: `
Email: realwarrenlee@gmail.com
GitHub: github.com/realwarrenlee
HuggingFace: huggingface.co/realwarrenlee
Weights & Biases: https://wandb.ai/realwarrenlee

Location: Singapore
Timezone: SGT (GMT +8)

Response time: Usually within 24 hours

The best way to reach me is through email. I read every message personally.`
        }
      }
    },
    '.hidden': {
      name: '.hidden',
      type: 'directory',
      children: {
        'easter-egg.txt': {
          name: 'easter-egg.txt',
          type: 'file',
          size: '0.3K',
          modified: '2025-05-22',
          content: `███████╗ █████╗ ███████╗████████╗███████╗██████╗     ███████╗ ██████╗  ██████╗ 
██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗    ██╔════╝██╔════╝ ██╔════╝ 
█████╗  ███████║███████╗   ██║   █████╗  ██████╔╝    █████╗  ██║  ███╗██║  ███╗
██╔══╝  ██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗    ██╔══╝  ██║   ██║██║   ██║
███████╗██║  ██║███████║   ██║   ███████╗██║  ██║    ███████╗╚██████╔╝╚██████╔╝
╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝`
        },
        'coffee': {
          name: 'coffee',
          type: 'file',
          size: '0.6K',
          modified: '2025-05-22',
          executable: true,
          content: `
      (  )   (   )  )
       ) (   )  (  (
       ( )  (    ) )
       _____________
      <_____________> ___
      |             |/ _ \\
      |               | | |
      |               |_| |
   ___|             |\\___/
  /    \\___________/    \\
  \\_____________________/
`
        },
        'cowsay': {
          name: 'cowsay',
          type: 'file',
          size: '0.5K',
          modified: '2025-05-22',
          executable: true,
          content: `
 _________________________________
 ---------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`
        },
        'trex': {
          name: 'trex',
          type: 'file',
          size: '2.1K',
          modified: '2025-05-22',
          executable: true,
          content: 
`          .-=-==--==--.
    ..-=="  ,'o\`)      \`.
,'         \`"'         \\
:  (                     \`.__...._
|                  )    /         \`-=-.
:       ,vv.-._   /    /               \`---==-._
 \\/\\/\\/VV ^ d88\`;'    /                         \`.
     \`\`  ^/d88P!'    /             ,              \`._
        ^/    !'   ,.      ,      /                  "-,,__,,--'""""-.
       ^/    !'  ,'  \\ . .(      (         _           )  ) ) ) ))_,-.\\
      ^(__ ,!',"'   ;:+.:%:a.     \\:.. . ,'          )  )  ) ) ,"'    '
      ',,,'','     /o:::":%:%a.    \\:.:.:         .    )  ) _,'
       """'       ;':::'' \`+%%%a._  \\%:%|         ;.). _,-""
              ,-='_.-'      \`\`:%::)  )%:|        /:._,"
             (/(/"           ," ,'_,'%%%:       (_,'
                            (  (//(\`.___;        \\
                             \\     \\    \`         \`
                              \`.    \`.   \`.        :
                                \\. . .\\    : . . . :
                                 \\. . .:    \`.. . .:
                                  \`..:.:\\     \\:...\\
                                   ;:.:.;      ::...:
                                   ):%::       :::::;
                               __,::%:(        :::::
                            ,;:%%%%%%%:        ;:%::
                              ;,--""-.\\\  ,=--':%:%:\\
                             /"       "| /-".:%%%%%%%\\
                                             ;,-"'\`)%%)
                                            /"      "|`
        }
      }
    }
  }
};